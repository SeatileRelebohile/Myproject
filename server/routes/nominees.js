const express = require('express');
const mysql = require('mysql2/promise');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'creator_awards'
};

// Create nomination
router.post('/nominate', authenticateToken, async (req, res) => {
  try {
    const {
      category,
      username,
      bio,
      profile_picture,
      social_links,
      is_paid_nominee = false
    } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if user already has a nomination in this category
    const [existing] = await connection.execute(
      'SELECT id FROM nominees WHERE user_id = ? AND category = ?',
      [req.user.userId, category]
    );
    
    if (existing.length > 0) {
      await connection.end();
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a nomination in this category' 
      });
    }
    
    // Generate shareable link
    const shareableLink = `${username.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    // Create nomination
    const [result] = await connection.execute(
      `INSERT INTO nominees (user_id, category, username, bio, profile_picture, social_links, is_paid_nominee, shareable_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        category,
        username,
        bio,
        profile_picture,
        JSON.stringify(social_links || []),
        is_paid_nominee,
        shareableLink
      ]
    );
    
    await connection.end();
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        shareable_link: shareableLink
      }
    });
  } catch (error) {
    console.error('Nomination error:', error);
    res.status(500).json({ success: false, message: 'Nomination failed' });
  }
});

// Get nominees by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const [nominees] = await connection.execute(
      `SELECT n.*, u.name as creator_name, u.paypal_email
       FROM nominees n
       JOIN users u ON n.user_id = u.id
       WHERE n.category = ? AND (n.main_board = TRUE OR n.total_votes >= 100)
       ORDER BY n.total_votes DESC`,
      [category]
    );
    
    await connection.end();
    
    const processedNominees = nominees.map(nominee => ({
      ...nominee,
      social_links: JSON.parse(nominee.social_links || '[]')
    }));
    
    res.json({ success: true, data: processedNominees });
  } catch (error) {
    console.error('Get nominees error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch nominees' });
  }
});

// Get all categories with top nominees
router.get('/categories', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [categories] = await connection.execute(
      'SELECT * FROM categories ORDER BY display_order'
    );
    
    const categoriesWithNominees = await Promise.all(
      categories.map(async (category) => {
        const [nominees] = await connection.execute(
          `SELECT n.*, u.name as creator_name
           FROM nominees n
           JOIN users u ON n.user_id = u.id
           WHERE n.category = ? AND (n.main_board = TRUE OR n.total_votes >= 100)
           ORDER BY n.total_votes DESC
           LIMIT 3`,
          [category.id]
        );
        
        return {
          ...category,
          top_nominees: nominees.map(nominee => ({
            ...nominee,
            social_links: JSON.parse(nominee.social_links || '[]')
          }))
        };
      })
    );
    
    await connection.end();
    
    res.json({ success: true, data: categoriesWithNominees });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Get nominee by shareable link
router.get('/share/:link', async (req, res) => {
  try {
    const { link } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const [nominees] = await connection.execute(
      `SELECT n.*, u.name as creator_name, u.paypal_email
       FROM nominees n
       JOIN users u ON n.user_id = u.id
       WHERE n.shareable_link = ?`,
      [link]
    );
    
    if (nominees.length === 0) {
      await connection.end();
      return res.status(404).json({ success: false, message: 'Nominee not found' });
    }
    
    const nominee = {
      ...nominees[0],
      social_links: JSON.parse(nominees[0].social_links || '[]')
    };
    
    await connection.end();
    
    res.json({ success: true, data: nominee });
  } catch (error) {
    console.error('Get nominee error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch nominee' });
  }
});

// Get creator dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get user's nominations
    const [nominations] = await connection.execute(
      'SELECT * FROM nominees WHERE user_id = ?',
      [req.user.userId]
    );
    
    // Get recent votes
    const [recentVotes] = await connection.execute(
      `SELECT v.*, n.username, n.category
       FROM votes v
       JOIN nominees n ON v.nominee_id = n.id
       WHERE n.user_id = ?
       ORDER BY v.vote_date DESC
       LIMIT 20`,
      [req.user.userId]
    );
    
    // Get earnings
    const [earnings] = await connection.execute(
      'SELECT * FROM earnings WHERE creator_id = ? ORDER BY year DESC, month DESC',
      [req.user.userId]
    );
    
    // Get milestones
    const [milestones] = await connection.execute(
      'SELECT * FROM milestones WHERE creator_id = ? ORDER BY achieved_at DESC',
      [req.user.userId]
    );
    
    await connection.end();
    
    res.json({
      success: true,
      data: {
        nominations: nominations.map(nom => ({
          ...nom,
          social_links: JSON.parse(nom.social_links || '[]')
        })),
        recent_votes: recentVotes,
        earnings,
        milestones
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;