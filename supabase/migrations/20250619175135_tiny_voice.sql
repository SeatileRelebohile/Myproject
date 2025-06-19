/*
  # Creator Awards 2025 Database Schema

  1. New Tables
    - `users` - Authentication for creators and voters
    - `nominees` - Creator profiles and nomination data
    - `votes` - Vote tracking with PayPal integration
    - `earnings` - Monthly earnings tracking for creators
    - `milestones` - Milestone bonuses (100K, 1M, 100M, 1B votes)
    - `payments` - PayPal payment tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Changes
    - Updated schema to support PayPal payments
    - Added milestone bonus system
    - Added earnings tracking
    - Added payment verification
*/

-- Users table for creators and voters
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('creator', 'voter', 'admin') DEFAULT 'voter',
  is_paid BOOLEAN DEFAULT FALSE,
  paypal_email VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nominees table for creator profiles
CREATE TABLE IF NOT EXISTS nominees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  category ENUM('facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'linkedin') NOT NULL,
  username VARCHAR(255) NOT NULL,
  bio TEXT,
  profile_picture VARCHAR(500),
  social_links JSON,
  total_votes INT DEFAULT 0,
  main_board BOOLEAN DEFAULT FALSE,
  is_paid_nominee BOOLEAN DEFAULT FALSE,
  shareable_link VARCHAR(255) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_total_votes (total_votes),
  INDEX idx_main_board (main_board)
);

-- Votes table with PayPal integration
CREATE TABLE IF NOT EXISTS votes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  voter_id INT NULL,
  nominee_id INT NOT NULL,
  voter_name VARCHAR(255),
  voter_email VARCHAR(255),
  amount DECIMAL(5,2) DEFAULT 5.00,
  paypal_transaction_id VARCHAR(255),
  paypal_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  vote_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (voter_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (nominee_id) REFERENCES nominees(id) ON DELETE CASCADE,
  INDEX idx_nominee_votes (nominee_id),
  INDEX idx_paypal_transaction (paypal_transaction_id)
);

-- Earnings table for monthly tracking
CREATE TABLE IF NOT EXISTS earnings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  creator_id INT NOT NULL,
  month VARCHAR(10) NOT NULL,
  year INT NOT NULL,
  votes INT DEFAULT 0,
  amount DECIMAL(10,2) DEFAULT 0.00,
  is_paid BOOLEAN DEFAULT FALSE,
  payout_date DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_creator_month (creator_id, month, year),
  INDEX idx_creator_earnings (creator_id),
  INDEX idx_payout_status (is_paid)
);

-- Milestones table for bonus tracking
CREATE TABLE IF NOT EXISTS milestones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  creator_id INT NOT NULL,
  milestone ENUM('100k', '1M', '100M', '1B') NOT NULL,
  bonus_amount DECIMAL(10,2) NOT NULL,
  achieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_paid BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_creator_milestone (creator_id, milestone),
  INDEX idx_creator_milestones (creator_id)
);

-- Payments table for PayPal transaction tracking
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  nominee_id INT,
  payment_type ENUM('vote', 'nomination', 'milestone', 'earnings') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paypal_transaction_id VARCHAR(255),
  paypal_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (nominee_id) REFERENCES nominees(id) ON DELETE SET NULL,
  INDEX idx_paypal_transaction (paypal_transaction_id),
  INDEX idx_payment_status (paypal_status)
);

-- Categories reference table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  display_order INT DEFAULT 0
);

-- Insert default categories
INSERT IGNORE INTO categories (id, name, description, icon, display_order) VALUES
('facebook', 'Facebook Account of the Year', 'Outstanding Facebook content creator with engaging posts and community building', 'Facebook', 1),
('instagram', 'Instagram Star of the Year', 'Instagram influencer with stunning visuals and engaging stories', 'Instagram', 2),
('twitter', 'Twitter Personality of the Year', 'Twitter user with witty content and strong community engagement', 'Twitter', 3),
('tiktok', 'TikTok Creator of the Year', 'Viral TikTok creator with creative and entertaining content', 'Music', 4),
('youtube', 'YouTube Channel of the Year', 'Outstanding YouTube channel with quality video content', 'Youtube', 5),
('linkedin', 'LinkedIn Professional of the Year', 'Professional content creator building meaningful business connections', 'Linkedin', 6);

-- Create triggers for automatic main_board updates
DELIMITER //

CREATE TRIGGER update_main_board_after_vote
AFTER UPDATE ON nominees
FOR EACH ROW
BEGIN
  IF NEW.total_votes >= 100 AND OLD.total_votes < 100 THEN
    UPDATE nominees SET main_board = TRUE WHERE id = NEW.id;
  END IF;
END//

DELIMITER ;

-- Create trigger for milestone checking
DELIMITER //

CREATE TRIGGER check_milestones_after_vote
AFTER UPDATE ON nominees
FOR EACH ROW
BEGIN
  DECLARE creator_user_id INT;
  
  SELECT user_id INTO creator_user_id FROM nominees WHERE id = NEW.id;
  
  -- Check for 100K milestone
  IF NEW.total_votes >= 100000 AND OLD.total_votes < 100000 THEN
    INSERT IGNORE INTO milestones (creator_id, milestone, bonus_amount)
    VALUES (creator_user_id, '100k', 3000.00);
  END IF;
  
  -- Check for 1M milestone
  IF NEW.total_votes >= 1000000 AND OLD.total_votes < 1000000 THEN
    INSERT IGNORE INTO milestones (creator_id, milestone, bonus_amount)
    VALUES (creator_user_id, '1M', 30000.00);
  END IF;
  
  -- Check for 100M milestone
  IF NEW.total_votes >= 100000000 AND OLD.total_votes < 100000000 THEN
    INSERT IGNORE INTO milestones (creator_id, milestone, bonus_amount)
    VALUES (creator_user_id, '100M', 1000000.00);
  END IF;
  
  -- Check for 1B milestone
  IF NEW.total_votes >= 1000000000 AND OLD.total_votes < 1000000000 THEN
    INSERT IGNORE INTO milestones (creator_id, milestone, bonus_amount)
    VALUES (creator_user_id, '1B', 10000000.00);
  END IF;
END//

DELIMITER ;