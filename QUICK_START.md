# 🚀 Quick Start Commands

## One-Command Setup (Recommended)
```bash
npm run setup
```
This will install all dependencies and seed the database with sample data.

## Start the Application
```bash
# Option 1: Smart startup (checks MongoDB, creates .env files)
npm run start-app

# Option 2: Manual startup
npm run dev
```

## Individual Commands

### Installation
```bash
# Install all dependencies
npm run install-all

# Or install separately
cd backend && npm install
cd ../frontend && npm install
```

### Database
```bash
# Seed database with sample data
npm run seed

# Clear database
cd backend && npm run db:clear

# View database statistics
cd backend && npm run db:stats
```

### Development
```bash
# Start both backend and frontend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client
```

### Production
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🔑 Default Login Credentials

After running `npm run seed`:

**Admin:**
- Email: `admin@batterystore.com`
- Password: `admin123`

**Regular Users:**
- Email: `john@example.com` / `jane@example.com`
- Password: `password123`

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🛠️ Prerequisites

Make sure you have:
- Node.js (v16+)
- MongoDB running locally
- Git

## 📱 What You'll See

1. **Home Page** - Amazon-inspired design with featured products
2. **Product Browsing** - Advanced filtering and search
3. **Product Details** - Image galleries and specifications
4. **Shopping Cart** - Add/remove items
5. **User Authentication** - Login/register system
6. **Admin Dashboard** - Manage products and orders

## 🎯 Quick Test

1. Run `npm run setup`
2. Run `npm run start-app`
3. Open http://localhost:3000
4. Login with admin credentials
5. Browse products and test features

---

**That's it! Your MERN e-commerce app is ready to go! 🎉**
