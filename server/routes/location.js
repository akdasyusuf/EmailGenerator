const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        city,
        region,
        country,
        created_at
      FROM locations
      ORDER BY city ASC
    `;
    
    const result = await pool.query(query);
    
    res.json({ locations: result.rows });
    
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: 'Failed to get locations' });
  }
});

// Get location by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        id,
        city,
        region,
        country,
        created_at
      FROM locations
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json({ location: result.rows[0] });
    
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ error: 'Failed to get location' });
  }
});

// Search locations
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const searchQuery = `
      SELECT 
        id,
        city,
        region,
        country
      FROM locations
      WHERE city ILIKE $1 OR region ILIKE $1
      ORDER BY city ASC
      LIMIT 10
    `;
    
    const result = await pool.query(searchQuery, [`%${query}%`]);
    
    res.json({ locations: result.rows });
    
  } catch (error) {
    console.error('Search locations error:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
});

module.exports = router;