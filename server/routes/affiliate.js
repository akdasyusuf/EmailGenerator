const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Track affiliate click and redirect
router.get('/redirect/:productId/:storeId', async (req, res) => {
  try {
    const { productId, storeId } = req.params;
    const userId = req.headers['user-id'] || 'anonymous';
    
    // Get affiliate URL
    const affiliateQuery = `
      SELECT 
        pp.affiliate_url,
        pp.product_url,
        s.name as store_name,
        s.domain as store_domain,
        p.name as product_name
      FROM product_prices pp
      JOIN stores s ON pp.store_id = s.id
      JOIN products p ON pp.product_id = p.id
      WHERE pp.product_id = $1 AND pp.store_id = $2
    `;
    
    const result = await pool.query(affiliateQuery, [productId, storeId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product or store not found' });
    }
    
    const { affiliate_url, product_url, store_name, store_domain, product_name } = result.rows[0];
    
    // Log the click
    await pool.query(
      'INSERT INTO affiliate_clicks (user_id, product_id, store_id, affiliate_url) VALUES ($1, $2, $3, $4)',
      [userId, productId, storeId, affiliate_url || product_url]
    );
    
    // Redirect to affiliate URL or product URL
    const redirectUrl = affiliate_url || product_url;
    
    res.json({
      success: true,
      redirect_url: redirectUrl,
      store_name,
      product_name,
      message: `Redirecting to ${store_name}...`
    });
    
  } catch (error) {
    console.error('Affiliate redirect error:', error);
    res.status(500).json({ error: 'Redirect failed' });
  }
});

// Get affiliate statistics
router.get('/stats', async (req, res) => {
  try {
    const { days = 30, store_id } = req.query;
    
    let whereClause = `WHERE ac.clicked_at >= NOW() - INTERVAL '${days} days'`;
    let params = [];
    
    if (store_id) {
      whereClause += ' AND ac.store_id = $1';
      params.push(store_id);
    }
    
    const statsQuery = `
      SELECT 
        s.name as store_name,
        s.domain as store_domain,
        s.affiliate_commission,
        COUNT(ac.id) as total_clicks,
        COUNT(DISTINCT ac.user_id) as unique_users,
        COUNT(DISTINCT ac.product_id) as unique_products
      FROM affiliate_clicks ac
      JOIN stores s ON ac.store_id = s.id
      ${whereClause}
      GROUP BY s.id, s.name, s.domain, s.affiliate_commission
      ORDER BY total_clicks DESC
    `;
    
    const result = await pool.query(statsQuery, params);
    
    // Calculate estimated earnings
    const statsWithEarnings = result.rows.map(row => ({
      ...row,
      estimated_earnings: (row.total_clicks * row.affiliate_commission * 0.01).toFixed(2)
    }));
    
    res.json({
      period_days: days,
      total_clicks: statsWithEarnings.reduce((sum, stat) => sum + parseInt(stat.total_clicks), 0),
      total_earnings: statsWithEarnings.reduce((sum, stat) => sum + parseFloat(stat.estimated_earnings), 0).toFixed(2),
      store_stats: statsWithEarnings
    });
    
  } catch (error) {
    console.error('Affiliate stats error:', error);
    res.status(500).json({ error: 'Failed to get affiliate statistics' });
  }
});

// Get top performing products
router.get('/top-products', async (req, res) => {
  try {
    const { days = 30, limit = 10 } = req.query;
    
    const topProductsQuery = `
      SELECT 
        p.name as product_name,
        p.brand,
        p.category,
        s.name as store_name,
        COUNT(ac.id) as click_count,
        pp.price,
        s.affiliate_commission
      FROM affiliate_clicks ac
      JOIN products p ON ac.product_id = p.id
      JOIN stores s ON ac.store_id = s.id
      JOIN product_prices pp ON ac.product_id = pp.product_id AND ac.store_id = pp.store_id
      WHERE ac.clicked_at >= NOW() - INTERVAL '${days} days'
      GROUP BY p.id, p.name, p.brand, p.category, s.id, s.name, s.affiliate_commission, pp.price
      ORDER BY click_count DESC
      LIMIT $1
    `;
    
    const result = await pool.query(topProductsQuery, [limit]);
    
    res.json({
      period_days: days,
      top_products: result.rows
    });
    
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ error: 'Failed to get top products' });
  }
});

// Update affiliate URLs for stores
router.put('/update-urls', async (req, res) => {
  try {
    const { store_id, affiliate_urls } = req.body;
    
    if (!store_id || !affiliate_urls) {
      return res.status(400).json({ error: 'Store ID and affiliate URLs are required' });
    }
    
    // Update affiliate URLs for the store
    const updateQuery = `
      UPDATE product_prices 
      SET affiliate_url = $1 
      WHERE store_id = $2 AND product_id = $3
    `;
    
    for (const { product_id, affiliate_url } of affiliate_urls) {
      await pool.query(updateQuery, [affiliate_url, store_id, product_id]);
    }
    
    res.json({ success: true, message: 'Affiliate URLs updated successfully' });
    
  } catch (error) {
    console.error('Update affiliate URLs error:', error);
    res.status(500).json({ error: 'Failed to update affiliate URLs' });
  }
});

module.exports = router;