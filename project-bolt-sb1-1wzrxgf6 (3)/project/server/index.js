const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'creator_awards'
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Database initialization
async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('nominee', 'admin', 'voter') DEFAULT 'nominee',
        nominee_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS nominees (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        platform VARCHAR(100) NOT NULL,
        profile_link TEXT NOT NULL,
        profile_image TEXT,
        bio TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        votes INT DEFAULT 0,
        is_visible BOOLEAN DEFAULT FALSE,
        shareable_link VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS social_links (
        id VARCHAR(36) PRIMARY KEY,
        nominee_id VARCHAR(36) NOT NULL,
        platform VARCHAR(100) NOT NULL,
        url TEXT NOT NULL,
        icon VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (nominee_id) REFERENCES nominees(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS votes (
        id VARCHAR(36) PRIMARY KEY,
        nominee_id VARCHAR(36) NOT NULL,
        category VARCHAR(100) NOT NULL,
        voter_identifier VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (nominee_id) REFERENCES nominees(id) ON DELETE CASCADE,
        UNIQUE KEY unique_vote (nominee_id, voter_identifier)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payment_requests (
        id VARCHAR(36) PRIMARY KEY,
        nominee_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (nominee_id) REFERENCES nominees(id) ON DELETE CASCADE
      )
    `);

    await connection.end();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      await connection.end();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      await connection.end();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    await connection.end();
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          nomineeId: user.nominee_id
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Nominee routes
app.post('/api/nominees/register', async (req, res) => {
  try {
    const {
      name, email, password, platform, profileLink, profileImage,
      bio, category, socialLinks
    } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if email already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      await connection.end();
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate IDs
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const nomineeId = `nominee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shareableLink = `${email.replace('@', '-').replace('.', '-')}-${Date.now()}`;
    
    await connection.beginTransaction();
    
    try {
      // Create user
      await connection.execute(
        'INSERT INTO users (id, email, password, role, nominee_id) VALUES (?, ?, ?, ?, ?)',
        [userId, email, hashedPassword, 'nominee', nomineeId]
      );
      
      // Create nominee
      await connection.execute(
        `INSERT INTO nominees (id, name, email, platform, profile_link, profile_image, bio, category, shareable_link)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nomineeId, name, email, platform, profileLink, profileImage, bio, category, shareableLink]
      );
      
      // Add social links
      if (socialLinks && socialLinks.length > 0) {
        for (const link of socialLinks) {
          const linkId = `social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await connection.execute(
            'INSERT INTO social_links (id, nominee_id, platform, url, icon) VALUES (?, ?, ?, ?, ?)',
            [linkId, nomineeId, link.platform, link.url, link.icon]
          );
        }
      }
      
      await connection.commit();
      await connection.end();
      
      res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
      await connection.rollback();
      await connection.end();
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.get('/api/nominees', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [nominees] = await connection.execute(`
      SELECT n.*, 
             GROUP_CONCAT(
               JSON_OBJECT(
                 'id', sl.id,
                 'platform', sl.platform,
                 'url', sl.url,
                 'icon', sl.icon
               )
             ) as social_links_json
      FROM nominees n
      LEFT JOIN social_links sl ON n.id = sl.nominee_id
      WHERE n.is_visible = TRUE OR n.votes >= 20
      GROUP BY n.id
      ORDER BY n.votes DESC
    `);
    
    // Parse social links JSON
    const nomineesWithSocialLinks = nominees.map(nominee => ({
      ...nominee,
      socialLinks: nominee.social_links_json 
        ? JSON.parse(`[${nominee.social_links_json}]`)
        : [],
      isVisible: nominee.is_visible === 1,
      shareableLink: nominee.shareable_link,
      paymentRequests: [],
      createdAt: nominee.created_at,
      updatedAt: nominee.updated_at
    }));
    
    await connection.end();
    
    res.json({ success: true, data: nomineesWithSocialLinks });
  } catch (error) {
    console.error('Get nominees error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch nominees' });
  }
});

app.get('/api/nominees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const [nominees] = await connection.execute(
      'SELECT * FROM nominees WHERE id = ?',
      [id]
    );
    
    if (nominees.length === 0) {
      await connection.end();
      return res.status(404).json({ success: false, message: 'Nominee not found' });
    }
    
    const [socialLinks] = await connection.execute(
      'SELECT * FROM social_links WHERE nominee_id = ?',
      [id]
    );
    
    const [paymentRequests] = await connection.execute(
      'SELECT * FROM payment_requests WHERE nominee_id = ? ORDER BY created_at DESC',
      [id]
    );
    
    await connection.end();
    
    const nominee = {
      ...nominees[0],
      socialLinks,
      paymentRequests,
      isVisible: nominees[0].is_visible === 1,
      shareableLink: nominees[0].shareable_link,
      createdAt: nominees[0].created_at,
      updatedAt: nominees[0].updated_at
    };
    
    res.json({ success: true, data: nominee });
  } catch (error) {
    console.error('Get nominee error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch nominee' });
  }
});

app.put('/api/nominees/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, socialLinks } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.beginTransaction();
    
    try {
      // Update nominee
      await connection.execute(
        'UPDATE nominees SET bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [bio, id]
      );
      
      // Update social links if provided
      if (socialLinks) {
        // Delete existing social links
        await connection.execute(
          'DELETE FROM social_links WHERE nominee_id = ?',
          [id]
        );
        
        // Add new social links
        for (const link of socialLinks) {
          const linkId = `social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await connection.execute(
            'INSERT INTO social_links (id, nominee_id, platform, url, icon) VALUES (?, ?, ?, ?, ?)',
            [linkId, id, link.platform, link.url, link.icon]
          );
        }
      }
      
      await connection.commit();
      
      // Fetch updated nominee
      const [nominees] = await connection.execute(
        'SELECT * FROM nominees WHERE id = ?',
        [id]
      );
      
      const [updatedSocialLinks] = await connection.execute(
        'SELECT * FROM social_links WHERE nominee_id = ?',
        [id]
      );
      
      await connection.end();
      
      const updatedNominee = {
        ...nominees[0],
        socialLinks: updatedSocialLinks,
        isVisible: nominees[0].is_visible === 1,
        shareableLink: nominees[0].shareable_link,
        createdAt: nominees[0].created_at,
        updatedAt: nominees[0].updated_at
      };
      
      res.json({ success: true, data: updatedNominee });
    } catch (error) {
      await connection.rollback();
      await connection.end();
      throw error;
    }
  } catch (error) {
    console.error('Update nominee error:', error);
    res.status(500).json({ success: false, message: 'Failed to update nominee' });
  }
});

// Vote routes
app.post('/api/votes', async (req, res) => {
  try {
    const { nomineeId, category } = req.body;
    const voterIdentifier = req.ip || 'anonymous';
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if user already voted in this category
    const [existingVotes] = await connection.execute(
      'SELECT id FROM votes WHERE category = ? AND voter_identifier = ?',
      [category, voterIdentifier]
    );
    
    if (existingVotes.length > 0) {
      await connection.end();
      return res.status(400).json({ success: false, message: 'Already voted in this category' });
    }
    
    await connection.beginTransaction();
    
    try {
      // Add vote
      const voteId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await connection.execute(
        'INSERT INTO votes (id, nominee_id, category, voter_identifier, ip_address) VALUES (?, ?, ?, ?, ?)',
        [voteId, nomineeId, category, voterIdentifier, req.ip]
      );
      
      // Update nominee vote count
      await connection.execute(
        'UPDATE nominees SET votes = votes + 1 WHERE id = ?',
        [nomineeId]
      );
      
      // Check if nominee should become visible (20+ votes)
      await connection.execute(
        'UPDATE nominees SET is_visible = TRUE WHERE id = ? AND votes >= 20',
        [nomineeId]
      );
      
      await connection.commit();
      await connection.end();
      
      res.json({ success: true, data: { id: voteId } });
    } catch (error) {
      await connection.rollback();
      await connection.end();
      throw error;
    }
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ success: false, message: 'Failed to cast vote' });
  }
});

// Payment request routes
app.post('/api/payment-requests', authenticateToken, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const nomineeId = req.user.nomineeId;
    
    if (!nomineeId) {
      return res.status(400).json({ success: false, message: 'Not a nominee account' });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    const requestId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await connection.execute(
      'INSERT INTO payment_requests (id, nominee_id, amount, description) VALUES (?, ?, ?, ?)',
      [requestId, nomineeId, amount, description]
    );
    
    const [requests] = await connection.execute(
      'SELECT * FROM payment_requests WHERE id = ?',
      [requestId]
    );
    
    await connection.end();
    
    res.json({ success: true, data: requests[0] });
  } catch (error) {
    console.error('Payment request error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment request' });
  }
});

app.get('/api/payment-requests', authenticateToken, async (req, res) => {
  try {
    const nomineeId = req.user.nomineeId;
    
    if (!nomineeId) {
      return res.status(400).json({ success: false, message: 'Not a nominee account' });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    const [requests] = await connection.execute(
      'SELECT * FROM payment_requests WHERE nominee_id = ? ORDER BY created_at DESC',
      [nomineeId]
    );
    
    await connection.end();
    
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get payment requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment requests' });
  }
});

// File upload route
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({ success: true, data: { url: fileUrl } });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});