const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { scrapeProductPrices } = require('../services/scraper');

// Search products with price comparison
router.get('/', async (req, res) => {
  try {
    const { query, location, limit = 20, sort = 'price_asc' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Get location ID
    let locationId = null;
    if (location) {
      const locationResult = await pool.query(
        'SELECT id FROM locations WHERE city ILIKE $1 OR region ILIKE $1',
        [location]
      );
      locationId = locationResult.rows[0]?.id;
    }

    // Search products
    const searchQuery = `
      SELECT DISTINCT 
        p.id,
        p.name,
        p.description,
        p.category,
        p.brand,
        p.model,
        p.image_url,
        MIN(pp.price) as min_price,
        MAX(pp.price) as max_price,
        COUNT(DISTINCT pp.store_id) as store_count
      FROM products p
      LEFT JOIN product_prices pp ON p.id = pp.product_id
      WHERE p.name ILIKE $1 
         OR p.description ILIKE $1 
         OR p.brand ILIKE $1 
         OR p.category ILIKE $1
      GROUP BY p.id, p.name, p.description, p.category, p.brand, p.model, p.image_url
      ORDER BY 
        CASE WHEN $2 = 'price_asc' THEN MIN(pp.price) END ASC,
        CASE WHEN $2 = 'price_desc' THEN MIN(pp.price) END DESC,
        CASE WHEN $2 = 'name_asc' THEN p.name END ASC,
        CASE WHEN $2 = 'name_desc' THEN p.name END DESC
      LIMIT $3
    `;

    const productsResult = await pool.query(searchQuery, [`%${query}%`, sort, limit]);
    
    // Get detailed price information for each product
    const productsWithPrices = await Promise.all(
      productsResult.rows.map(async (product) => {
        const pricesQuery = `
          SELECT 
            pp.price,
            pp.original_price,
            pp.currency,
            pp.affiliate_url,
            pp.product_url,
            pp.in_stock,
            pp.last_updated,
            s.name as store_name,
            s.domain as store_domain,
            s.logo_url as store_logo,
            s.affiliate_program,
            s.affiliate_commission
          FROM product_prices pp
          JOIN stores s ON pp.store_id = s.id
          WHERE pp.product_id = $1
          ORDER BY pp.price ASC
        `;
        
        const pricesResult = await pool.query(pricesQuery, [product.id]);
        
        return {
          ...product,
          prices: pricesResult.rows
        };
      })
    );

    // Log search history
    await pool.query(
      'INSERT INTO search_history (user_id, query, location_id, results_count) VALUES ($1, $2, $3, $4)',
      [req.headers['user-id'] || 'anonymous', query, locationId, productsWithPrices.length]
    );

    res.json({
      query,
      location,
      total_results: productsWithPrices.length,
      products: productsWithPrices
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestionsQuery = `
      SELECT DISTINCT 
        p.name,
        p.category,
        p.brand,
        COUNT(*) as popularity
      FROM products p
      WHERE p.name ILIKE $1 
         OR p.brand ILIKE $1 
         OR p.category ILIKE $1
      GROUP BY p.name, p.category, p.brand
      ORDER BY popularity DESC, p.name ASC
      LIMIT $2
    `;

    const result = await pool.query(suggestionsQuery, [`%${query}%`, limit]);
    
    res.json({ suggestions: result.rows });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Get popular searches
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;
    
    const popularQuery = `
      SELECT 
        query,
        COUNT(*) as search_count
      FROM search_history
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY query
      ORDER BY search_count DESC
      LIMIT $1
    `;

    const result = await pool.query(popularQuery, [limit]);
    
    res.json({ popular_searches: result.rows });

  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({ error: 'Failed to get popular searches' });
  }
});

module.exports = router;