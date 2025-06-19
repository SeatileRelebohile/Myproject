const express = require('express');
const mysql = require('mysql2/promise');
const { client } = require('../config/paypal');
const paypal = require('@paypal/checkout-server-sdk');
const router = express.Router();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'creator_awards'
};

// Create PayPal order for voting
router.post('/create-order', async (req, res) => {
  try {
    const { nominee_id, voter_name, voter_email } = req.body;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '5.00'
        },
        description: `Vote for nominee ${nominee_id}`,
        custom_id: `vote_${nominee_id}_${Date.now()}`
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/vote/success`,
        cancel_url: `${process.env.FRONTEND_URL}/vote/cancel`
      }
    });
    
    const order = await client().execute(request);
    
    // Store pending vote
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      `INSERT INTO votes (nominee_id, voter_name, voter_email, amount, paypal_transaction_id, paypal_status)
       VALUES (?, ?, ?, 5.00, ?, 'pending')`,
      [nominee_id, voter_name, voter_email, order.result.id]
    );
    await connection.end();
    
    res.json({
      success: true,
      data: {
        order_id: order.result.id,
        approval_url: order.result.links.find(link => link.rel === 'approve').href
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// Capture PayPal payment
router.post('/capture-order', async (req, res) => {
  try {
    const { order_id } = req.body;
    
    const request = new paypal.orders.OrdersCaptureRequest(order_id);
    request.requestBody({});
    
    const capture = await client().execute(request);
    
    if (capture.result.status === 'COMPLETED') {
      const connection = await mysql.createConnection(dbConfig);
      
      // Update vote status
      await connection.execute(
        'UPDATE votes SET paypal_status = "completed" WHERE paypal_transaction_id = ?',
        [order_id]
      );
      
      // Get the vote details
      const [votes] = await connection.execute(
        'SELECT * FROM votes WHERE paypal_transaction_id = ?',
        [order_id]
      );
      
      if (votes.length > 0) {
        const vote = votes[0];
        
        // Update nominee vote count
        await connection.execute(
          'UPDATE nominees SET total_votes = total_votes + 1 WHERE id = ?',
          [vote.nominee_id]
        );
        
        // Update monthly earnings
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        
        // Get nominee's creator
        const [nominees] = await connection.execute(
          'SELECT user_id FROM nominees WHERE id = ?',
          [vote.nominee_id]
        );
        
        if (nominees.length > 0) {
          const creator_id = nominees[0].user_id;
          
          // Update or create earnings record
          await connection.execute(
            `INSERT INTO earnings (creator_id, month, year, votes, amount)
             VALUES (?, ?, ?, 1, 5.00)
             ON DUPLICATE KEY UPDATE
             votes = votes + 1,
             amount = amount + 5.00`,
            [creator_id, month, year]
          );
        }
      }
      
      await connection.end();
      
      res.json({
        success: true,
        data: {
          transaction_id: capture.result.id,
          status: capture.result.status
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Capture order error:', error);
    res.status(500).json({ success: false, message: 'Failed to capture payment' });
  }
});

// Get votes for a nominee
router.get('/nominee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const [votes] = await connection.execute(
      `SELECT voter_name, voter_email, amount, vote_date
       FROM votes
       WHERE nominee_id = ? AND paypal_status = 'completed'
       ORDER BY vote_date DESC`,
      [id]
    );
    
    await connection.end();
    
    res.json({ success: true, data: votes });
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch votes' });
  }
});

module.exports = router;