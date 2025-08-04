const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all stores
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        name,
        domain,
        logo_url,
        affiliate_program,
        affiliate_commission,
        created_at,
        updated_at
      FROM stores
      ORDER BY name ASC
    `;
    
    const result = await pool.query(query);
    
    res.json({ stores: result.rows });
    
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to get stores' });
  }
});

// Get store by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        id,
        name,
        domain,
        logo_url,
        affiliate_program,
        affiliate_commission,
        created_at,
        updated_at
      FROM stores
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json({ store: result.rows[0] });
    
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Failed to get store' });
  }
});

// Get store statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT pp.product_id) as total_products,
        COUNT(DISTINCT ac.id) as total_clicks,
        COUNT(DISTINCT ac.user_id) as unique_users,
        AVG(pp.price) as avg_price,
        MIN(pp.price) as min_price,
        MAX(pp.price) as max_price
      FROM stores s
      LEFT JOIN product_prices pp ON s.id = pp.store_id
      LEFT JOIN affiliate_clicks ac ON s.id = ac.store_id 
        AND ac.clicked_at >= NOW() - INTERVAL '${days} days'
      WHERE s.id = $1
    `;
    
    const result = await pool.query(statsQuery, [id]);
    
    res.json({ stats: result.rows[0] });
    
  } catch (error) {
    console.error('Get store stats error:', error);
    res.status(500).json({ error: 'Failed to get store statistics' });
  }
});

module.exports = router;