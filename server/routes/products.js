const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, brand, sort = 'name_asc' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramIndex = 1;
    
    if (category) {
      whereClause += ` AND p.category ILIKE $${paramIndex}`;
      params.push(`%${category}%`);
      paramIndex++;
    }
    
    if (brand) {
      whereClause += ` AND p.brand ILIKE $${paramIndex}`;
      params.push(`%${brand}%`);
      paramIndex++;
    }
    
    const query = `
      SELECT 
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
      ${whereClause}
      GROUP BY p.id, p.name, p.description, p.category, p.brand, p.model, p.image_url
      ORDER BY 
        CASE WHEN $${paramIndex} = 'price_asc' THEN MIN(pp.price) END ASC,
        CASE WHEN $${paramIndex} = 'price_desc' THEN MIN(pp.price) END DESC,
        CASE WHEN $${paramIndex} = 'name_asc' THEN p.name END ASC,
        CASE WHEN $${paramIndex} = 'name_desc' THEN p.name END DESC
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
    `;
    
    params.push(sort, limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      products: result.rows,
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.rows.length
    });
    
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get product by ID with all prices
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get product details
    const productQuery = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category,
        p.brand,
        p.model,
        p.image_url,
        p.created_at,
        p.updated_at
      FROM products p
      WHERE p.id = $1
    `;
    
    const productResult = await pool.query(productQuery, [id]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResult.rows[0];
    
    // Get all prices for this product
    const pricesQuery = `
      SELECT 
        pp.price,
        pp.original_price,
        pp.currency,
        pp.affiliate_url,
        pp.product_url,
        pp.in_stock,
        pp.last_updated,
        s.id as store_id,
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
    
    const pricesResult = await pool.query(pricesQuery, [id]);
    
    res.json({
      ...product,
      prices: pricesResult.rows,
      price_range: {
        min: Math.min(...pricesResult.rows.map(p => p.price)),
        max: Math.max(...pricesResult.rows.map(p => p.price))
      }
    });
    
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT category, COUNT(*) as product_count
      FROM products
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY product_count DESC
    `;
    
    const result = await pool.query(query);
    
    res.json({ categories: result.rows });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get product brands
router.get('/brands/list', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT brand, COUNT(*) as product_count
      FROM products
      WHERE brand IS NOT NULL
      GROUP BY brand
      ORDER BY product_count DESC
    `;
    
    const result = await pool.query(query);
    
    res.json({ brands: result.rows });
    
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: 'Failed to get brands' });
  }
});

module.exports = router;