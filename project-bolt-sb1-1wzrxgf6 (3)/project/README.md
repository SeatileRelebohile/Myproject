# Creator Awards Platform

A comprehensive voting platform for social media content creators with authentication, profile management, payment requests, and MySQL database integration.

## Features

### For Nominees
- **Registration & Authentication**: Secure signup with email/password
- **Profile Management**: Edit bio, upload profile images, manage social media links (up to 5)
- **Visibility Control**: Profiles become visible on main site after reaching 20 votes
- **Shareable Links**: Unique links for nominees to share with fans
- **Payment Requests**: Request payments with amount and description
- **Vote Tracking**: Real-time vote counts and category rankings

### For Voters
- **Category Voting**: Vote once per category across 6 award categories
- **Nominee Discovery**: Browse visible nominees (20+ votes) on main site
- **Direct Voting**: Vote via shareable links for nominees under 20 votes
- **Real-time Results**: Live leaderboards and voting statistics

### Technical Features
- **MySQL Database**: Complete data persistence with relational structure
- **Image Upload**: Profile picture upload with file validation
- **JWT Authentication**: Secure token-based authentication
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live vote counts and rankings

## Database Schema

### Tables
- `users` - Authentication and user roles
- `nominees` - Creator profiles and information
- `social_links` - Social media links (up to 5 per nominee)
- `votes` - Vote tracking with IP and category restrictions
- `payment_requests` - Payment requests from nominees

## Setup Instructions

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   npm install
   ```

2. Create MySQL database:
   ```sql
   CREATE DATABASE creator_awards;
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=creator_awards
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Nominees
- `POST /api/nominees/register` - Register new nominee
- `GET /api/nominees` - Get all visible nominees
- `GET /api/nominees/:id` - Get specific nominee
- `PUT /api/nominees/:id` - Update nominee profile

### Voting
- `POST /api/votes` - Cast a vote

### Payment Requests
- `POST /api/payment-requests` - Create payment request
- `GET /api/payment-requests` - Get nominee's payment requests

### File Upload
- `POST /api/upload` - Upload profile images

## Award Categories

1. **Facebook Account of the Year**
2. **TikTok Creator of the Year**
3. **Instagram Star of the Year**
4. **Twitter Personality of the Year**
5. **YouTube Channel of the Year**
6. **Rising Star**

## Visibility Rules

- Nominees need **20+ votes** to appear on the main website
- Nominees with fewer than 20 votes are only accessible via their shareable link
- This creates an incentive for nominees to actively promote their participation

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- IP-based vote limiting
- File upload validation
- SQL injection protection
- CORS configuration

## Technologies Used

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Context API for state management

### Backend
- Node.js with Express
- MySQL with mysql2 driver
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.