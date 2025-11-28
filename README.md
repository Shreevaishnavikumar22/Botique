# Flower Boutique — Full-Stack E‑commerce

A polished, full-stack Flower Boutique e-commerce application built with the MERN stack (MongoDB, Express, React, Node). This repository contains a production-like storefront and an admin backend for managing products, orders, users, and simple payments. It is designed for local development and easy deployment to common cloud providers.

**Highlights**
- **Beautiful product pages** with image galleries and graceful fallbacks
- **Cart & Checkout** flow with order history and basic payment integration (Razorpay placeholder)
- **Admin dashboard** for managing products, orders and users
- **Seed data & upload support** for populating sample flower products and local images

## **Features**
- **Authentication**: JWT-based auth, protected routes, admin privileges
- **Product management**: categories, variants, images array support, search and filters
- **Shopping cart**: add/update/remove items, persistent cart per user
- **Orders**: create and list user orders, admin order status updates
- **Payments**: server-side order creation and signature verification (Razorpay)
- **Uploads**: local `backend/uploads` support (easy to swap to Cloudinary/S3)
- **Developer tooling**: seed scripts, cleanup scripts, and helpful start scripts

## **Tech Stack**
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **Frontend**: React (Create React App), Redux Toolkit, React Router
- **Styling**: Tailwind CSS
- **Other**: Multer (uploads), Razorpay SDK (payments), Helmet, CORS

## **Quick Start (Windows PowerShell)**

1) Clone the repo

```powershell
git clone <repository-url>
cd botique
```

2) Install dependencies

```powershell
# Backend
cd backend
npm install

# Frontend (new shell)
cd ..\frontend
npm install
```

3) Configure environment variables

Copy the example and edit values in `backend/config.env` (or create `backend/config.env` from `config.env.example`):

```text
# Minimum required values
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/flower-ecommerce
JWT_SECRET=change_this_to_a_secure_secret
FRONTEND_URL=http://localhost:3000
# Razorpay (use test keys to try payments)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

On the frontend you can set the API base (optional):

```powershell
cd frontend
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env
```

4) Seed sample flower products (optional but recommended)

```powershell
cd ..\backend
node scripts/seedFlowerProducts.js
```

5) Run backend and frontend

Open two PowerShell windows or tabs:

```powershell
# Window 1 - Start backend
cd botique\backend
node server.js

# Window 2 - Start frontend
cd botique\frontend
npm start
```

Frontend: `http://localhost:3000` — Backend API: `http://localhost:5001/api`

## **Environment Variables**
- `MONGODB_URI` — MongoDB connection string
- `PORT` — backend server port (default: `5001` in this project)
- `JWT_SECRET` — secret string for signing JWTs
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — Razorpay test keys (required for payments)
- `FRONTEND_URL` — allowed origin for CORS

Keep secret values out of source control; use `.gitignore` (already present) to prevent accidental commits.

## **Seeding & Uploads**
- Seed script: `backend/scripts/seedFlowerProducts.js` — creates sample flower products that match the Product schema.
- Local uploads directory: `backend/uploads/products/` — the server serves images from `/uploads`.
- To add product images manually: place files in `backend/uploads/products/` and reference their filenames/URLs when creating products (or re-run the seed script).

## **API Overview (selected)**
- `GET /api/products` — list products (filters & pagination supported)
- `GET /api/products/:id` — get product details
- `POST /api/auth/login` — user login
- `GET /api/cart` — get current user's cart
- `POST /api/payment/orders` — create a payment order (protected)
- `POST /api/payment/verify` — verify payment signature and complete order

Refer to the `backend/routes/` folder for full endpoint listings.

## **Development Tips**
- If ports are in use, stop orphan Node processes or change `PORT` in `backend/config.env`.
- Use the seed script to populate sample data matching the Product schema.
- The project contains an `ErrorBoundary` component on the frontend to avoid white-screen crashes during development.

## **Deployment**
- Backend: deploy to Render/Heroku/DigitalOcean — set environment variables in the host's dashboard.
- Frontend: build with `npm run build` and deploy to Vercel/Netlify or serve the `build/` directory from a static host.

## **Contribution**
- Fork, create a feature branch, implement changes, add tests, and open a pull request.

## **License**
- MIT — see `LICENSE` (if present) or add one to the repository.

## **Contact & Support**
- For questions or issues, open an issue in this repository or contact the maintainer.

---

Built with care for florists and shoppers 🌸
# Battery E-commerce Application

A full-fledged MERN stack e-commerce application for selling batteries, inspired by Amazon India. Built with modern technologies and best practices.

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Email verification system
- Password reset functionality
- Persistent login using tokens
- User profile management

### Product Management
- Browse products with advanced filtering and sorting
- Product categories (Inverter, Car, Bike, UPS, Solar, Industrial batteries)
- Search functionality with autocomplete
- Product details with image gallery
- Ratings and reviews system
- Featured products and new arrivals

### Shopping Experience
- Add to cart functionality
- Shopping cart management
- Wishlist feature
- Checkout process with address management
- Order tracking and history
- Payment integration (placeholder for Razorpay)

### Admin Dashboard
- Product management (CRUD operations)
- Order management and status updates
- User management
- Sales reports and analytics
- Inventory management

### UI/UX Features
- Responsive design for all devices
- Amazon-inspired clean interface
- Tailwind CSS for modern styling
- Smooth animations with Framer Motion
- Loading states and error handling
- Toast notifications

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for image uploads
- **Nodemailer** for email services
- **Multer** for file handling

### Frontend
- **React 18** with hooks
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Query** for server state
- **Axios** for API calls
- **React Hook Form** for form handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone & Install
```bash
git clone <repository-url>
cd ecom

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Environment Setup
```bash
# Backend environment
cd backend
cp config.env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend environment
cd ../frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 3. Database Setup
```bash
# Make sure MongoDB is running, then seed the database
cd backend
npm run seed
```

### 4. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### 6. Default Login Credentials
After seeding the database:

**Admin User:**
- Email: `admin@batterystore.com`
- Password: `admin123`

**Regular Users:**
- Email: `john@example.com` / `jane@example.com`
- Password: `password123`

## 📦 Detailed Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd battery-ecommerce
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp config.env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/battery-ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

### Quick Start (Both Backend & Frontend)

From the root directory:
```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories
- `GET /api/products/brands` - Get brands
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - All users
- `GET /api/admin/sales-report` - Sales report

## 🗂️ Project Structure

```
battery-ecommerce/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── config.env.example   # Environment variables template
│   └── server.js            # Server entry point
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── utils/           # Utility functions
│   │   └── App.js           # Main app component
│   └── package.json
├── package.json             # Root package.json
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## 🔧 Development

### Available Scripts

**Root level:**
- `npm run dev` - Start both backend and frontend
- `npm run install-all` - Install all dependencies
- `npm run build` - Build frontend for production

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support, email support@batteryecommerce.com or create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Razorpay)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Product comparison feature
- [ ] Loyalty program
- [ ] Social media integration
- [ ] Advanced inventory management

---

**Built with ❤️ using MERN stack**
