# 🚀 Battery E-commerce Setup Guide

This guide will help you set up and run the MERN stack battery e-commerce application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ecom
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```bash
cp config.env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/battery-ecommerce

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server
NODE_ENV=development
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd ../frontend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:
```bash
touch .env
```

Add the following to the frontend `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## 🗄️ Database Setup

### Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Seed the Database
```bash
cd backend
npm run seed
```

This will populate your database with:
- Sample users (admin and regular users)
- 8 battery products across different categories
- Sample data for testing

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

#### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

### Option 2: Run Both with Concurrently (Recommended)

#### Install concurrently globally
```bash
npm install -g concurrently
```

#### From the root directory, run both servers
```bash
npm run dev
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm run db:clear   # Clear all data from database
npm run db:stats   # Show database statistics
npm run db:backup  # Create database backup
npm run db:export  # Export data to JSON file
npm run db:import  # Import data from JSON file
```

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run eject      # Eject from Create React App
```

## 🧪 Testing the Application

### 1. Check Backend Health
Visit: http://localhost:5000/api/health

### 2. Default Login Credentials
After seeding the database, you can use these credentials:

**Admin User:**
- Email: `admin@batterystore.com`
- Password: `admin123`

**Regular Users:**
- Email: `john@example.com`
- Password: `password123`
- Email: `jane@example.com`
- Password: `password123`

### 3. Sample Products
The database includes 8 battery products:
- Inverter Batteries (Exide, Amara Raja, Luminous)
- Car Batteries (Exide, Amara Raja)
- Bike Batteries (Exide)
- UPS Batteries (Luminous)
- Solar Batteries (Luminous)

## 🎯 Key Features to Test

1. **Authentication**
   - User registration and login
   - Password reset functionality
   - Protected routes

2. **Product Browsing**
   - Browse all products
   - Filter by category, brand, price
   - Search functionality
   - Product detail pages

3. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Persistent cart

4. **User Profile**
   - View and edit profile
   - Manage addresses
   - Order history

5. **Admin Features**
   - Product management
   - User management
   - Order management
   - Analytics dashboard

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running and accessible.

#### Port Already in Use
```bash
Error: listen EADDRINUSE :::5000
```
**Solution:** Change the PORT in your `.env` file or kill the process using the port.

#### CORS Issues
**Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL.

#### Missing Dependencies
```bash
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` in the respective directory.

### Database Issues

#### Reset Database
```bash
cd backend
npm run db:clear
npm run seed
```

#### View Database Stats
```bash
cd backend
npm run db:stats
```

## 📱 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your `.env`
2. Use a production MongoDB instance
3. Set up proper JWT secrets
4. Configure CORS for your production domain

### Frontend Deployment
1. Run `npm run build` in the frontend directory
2. Serve the `build` folder with a web server
3. Update `REACT_APP_API_URL` to your production backend URL

## 🔒 Security Considerations

1. **Never commit `.env` files**
2. **Use strong JWT secrets**
3. **Enable HTTPS in production**
4. **Configure proper CORS settings**
5. **Use environment-specific database URLs**

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check environment variable configuration
5. Review the troubleshooting section above

## 🎉 You're Ready!

Once everything is set up, you can:
- Browse products at http://localhost:3000
- Test the admin panel with admin credentials
- Explore all the e-commerce features
- Customize the application for your needs

Happy coding! 🚀
