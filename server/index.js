const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_tech_rescue'
};

// Initialize database and create table
async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    
    // Connect to the database and create table
    const dbConnection = await mysql.createConnection(dbConfig);
    
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        in_stock BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert sample data if table is empty
    const [rows] = await dbConnection.execute('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      await dbConnection.execute(`
        INSERT INTO products (name, price, category, description, image_url, in_stock) VALUES
        ('iPhone 14 Pro Screen Repair', 299.99, 'Repair Services', 'Professional iPhone 14 Pro screen replacement with genuine parts. Quick turnaround time.', 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400', TRUE),
        ('MacBook Pro Logic Board Repair', 449.99, 'Repair Services', 'Expert MacBook Pro logic board diagnosis and repair. Data recovery included.', 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400', TRUE),
        ('Samsung Galaxy S23 Battery Replacement', 89.99, 'Repair Services', 'High-quality battery replacement for Samsung Galaxy S23. Extends device lifespan.', 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400', TRUE),
        ('Custom Gaming PC Build', 1299.99, 'Custom Builds', 'High-performance gaming PC with RTX 4070, AMD Ryzen 7, 32GB RAM. Ready to dominate.', 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400', TRUE),
        ('Business Workstation Setup', 899.99, 'Custom Builds', 'Professional workstation optimized for productivity. Intel i7, 16GB RAM, SSD storage.', 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400', TRUE),
        ('Wireless Charging Pad Pro', 49.99, 'Accessories', 'Fast wireless charging for all Qi-enabled devices. Sleek design with LED indicators.', 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=400', TRUE)
      `);
    }
    
    await dbConnection.end();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM products WHERE in_stock = TRUE ORDER BY created_at DESC'
    );
    await connection.end();
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, category, description, image_url } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required'
      });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO products (name, price, category, description, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, parseFloat(price), category, description || '', image_url || '']
    );
    await connection.end();
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        message: 'Product added successfully'
      }
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product'
    });
  }
});

// Update product stock status
app.patch('/api/products/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { in_stock } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE products SET in_stock = ? WHERE id = ?',
      [in_stock, id]
    );
    await connection.end();
    
    res.json({
      success: true,
      message: 'Product stock status updated'
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product stock'
    });
  }
});

// Serve static files
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Smart Tech Rescue server running on port ${PORT}`);
    console.log(`Customer site: http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
  });
});