# 🏠 Hero Home Server

Backend API for the Hero Home service booking platform - a marketplace connecting service providers with customers for home services like plumbing, electrical, cleaning, and more.

---

## 🚀 **Live Deployment**

**Production API:**
```
https://hero-home-server-five.vercel.app
```

**API Base URL:**
```
https://hero-home-server-five.vercel.app/api
```

**Health Check:**
```bash
curl https://hero-home-server-five.vercel.app/
```

---

## 🛠️ **Tech Stack**

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4.x
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** Firebase Admin SDK
- **Deployment:** Vercel Serverless Functions
- **Language:** JavaScript (ES6+)

---

## 📋 **Prerequisites**

Before installation, ensure you have:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (comes with Node.js)
- **MongoDB** account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Firebase** project ([Firebase Console](https://console.firebase.google.com/))
- **Vercel** account (for deployment) ([Vercel](https://vercel.com))

---

## 📦 **Installation**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rafi1105/hero-home.git
cd hero-home/hero-home-server
```

### 2️⃣ Install Dependencies

```bash
npm install
```

**Required Dependencies:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `firebase-admin` - Firebase authentication
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 3️⃣ Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/herohome?retryWrites=true&w=majority

# Firebase Admin SDK (Option 1: Base64 - Recommended for Production)
FIREBASE_SERVICE_KEY=<base64-encoded-service-account-json>

# Firebase Admin SDK (Option 2: Individual Variables - Fallback)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 4️⃣ Firebase Service Account Setup

**Generate Base64 Encoded Service Account:**

```bash
node encode.js
```

Copy the output and paste it as the value for `FIREBASE_SERVICE_KEY` in your `.env` file.

---

## 🏃 **Running Locally**

### Development Mode

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### Production Mode

```bash
npm start
```

### Seed Database

Populate MongoDB with sample data:

```bash
node seed.js
```

---

## 🌐 **Deployment to Vercel**

### 1️⃣ Install Vercel CLI

```bash
npm install -g vercel
```

### 2️⃣ Login to Vercel

```bash
vercel login
```

### 3️⃣ Configure Environment Variables

Go to your Vercel project dashboard or use CLI:

```bash
vercel env add MONGODB_URI
vercel env add FIREBASE_SERVICE_KEY
vercel env add NODE_ENV
```

**Required Environment Variables:**
- `MONGODB_URI` - Your MongoDB connection string
- `FIREBASE_SERVICE_KEY` - Base64 encoded service account JSON
- `NODE_ENV` - Set to `production`

### 4️⃣ Deploy

**Preview Deployment:**
```bash
vercel
```

**Production Deployment:**
```bash
vercel --prod
```

### 5️⃣ Access Your Deployment

After deployment, Vercel provides:
- **Production URL:** `https://your-project.vercel.app`
- **Preview URLs:** For each git push
- **Deployment Logs:** In Vercel dashboard

---

## 🔑 **API Documentation**

### **Base URL**
```
Local: http://localhost:5000/api
Production: https://hero-home-server-five.vercel.app/api
```

### **Public Endpoints**

#### Health Check
```bash
GET /
GET /api/health
```

#### Services
```bash
GET /api/services                    # Get all services
GET /api/services/top-rated          # Get top-rated services
GET /api/services/:id                # Get service by ID
GET /api/services?category=plumbing  # Filter by category
GET /api/services?minPrice=20&maxPrice=100  # Filter by price
GET /api/services?search=repair      # Search services
```

#### Reviews
```bash
GET /api/reviews                     # Get all reviews
GET /api/reviews/:id                 # Get review by ID
GET /api/reviews/service/:serviceId  # Get reviews for a service
```

#### Users
```bash
POST /api/users                      # Create user (registration)
```

### **Protected Endpoints** (Require Firebase Authentication)

Add header: `Authorization: Bearer <firebase-token>`

#### Services
```bash
POST /api/services                   # Create service
PUT /api/services/:id                # Update service
DELETE /api/services/:id             # Delete service
GET /api/services/user/:userId       # Get user's services
POST /api/services/:id/review        # Add review to service
```

#### Bookings
```bash
GET /api/bookings                    # Get all bookings
POST /api/bookings                   # Create booking
GET /api/bookings/:id                # Get booking by ID
GET /api/bookings/user/:userId       # Get user bookings
GET /api/bookings/provider/:userId   # Get provider bookings
PUT /api/bookings/:id/status         # Update booking status
PUT /api/bookings/:id/cancel         # Cancel booking
```

#### Users
```bash
GET /api/users                       # Get all users
GET /api/users/:id                   # Get user by ID
PUT /api/users/:id                   # Update user
DELETE /api/users/:id                # Delete user
GET /api/users/:userId/provider-stats # Get provider statistics
```

**📖 Full API Documentation:** See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

---

## 📁 **Project Structure**

```
hero-home-server/
├── config/
│   ├── db.js                 # MongoDB connection with serverless caching
│   └── firebase.config.js    # Firebase Admin SDK initialization
├── controllers/
│   ├── bookingController.js  # Booking business logic
│   ├── reviewController.js   # Review business logic
│   ├── serviceController.js  # Service business logic
│   └── userController.js     # User business logic
├── middleware/
│   └── authMiddleware.js     # Firebase token verification
├── models/
│   ├── Booking.js            # Booking schema
│   ├── Review.js             # Review schema
│   ├── Service.js            # Service schema
│   └── User.js               # User schema
├── routes/
│   ├── bookingRoutes.js      # Booking endpoints
│   ├── reviewRoutes.js       # Review endpoints
│   ├── serviceRoutes.js      # Service endpoints
│   └── userRoutes.js         # User endpoints
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── encode.js                 # Firebase service account encoder
├── package.json              # Dependencies and scripts
├── seed.js                   # Database seeder
├── server.js                 # Express app entry point
└── vercel.json               # Vercel deployment config
```

---

## 🔒 **Security**

- **Firebase Authentication:** All protected routes verify Firebase tokens
- **CORS:** Configured to allow client requests
- **Environment Variables:** Sensitive data stored securely
- **Input Validation:** Mongoose schema validation
- **Error Handling:** Comprehensive error middleware

---

## 🧪 **Testing**

### Test Public Endpoints

```bash
# Health check
curl https://hero-home-server-five.vercel.app/

# Get services
curl https://hero-home-server-five.vercel.app/api/services

# Filter services
curl "https://hero-home-server-five.vercel.app/api/services?category=plumbing"
```

### Test Protected Endpoints

```bash
# Get bookings (requires auth token)
curl https://hero-home-server-five.vercel.app/api/bookings \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

**Complete Testing Guide:** See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

---

## 🐛 **Troubleshooting**

### MongoDB Connection Issues

**Error:** `Cannot call services.find() before initial connection is complete`

**Solution:**
- Ensure `MONGODB_URI` is correctly set in environment variables
- Check MongoDB Atlas whitelist includes Vercel IPs or use `0.0.0.0/0`
- Verify database user has proper permissions

### Firebase Authentication Issues

**Error:** `Firebase Admin SDK initialization failed`

**Solution:**
- Verify `FIREBASE_SERVICE_KEY` is base64 encoded
- Check service account has correct permissions
- Ensure Firebase project is active

### Vercel Deployment Issues

**Error:** `Route not found` or `404`

**Solution:**
- Verify `vercel.json` points to `server.js`
- Check all environment variables are set in Vercel dashboard
- Review deployment logs in Vercel dashboard

### CORS Issues

**Error:** `Access-Control-Allow-Origin` errors

**Solution:**
- Update `CLIENT_URL` in environment variables
- Ensure CORS middleware is properly configured

---

## 📊 **Database Models**

### Service
- Name, category, description, price
- Provider information
- Rating and review count
- Availability status

### Booking
- Service reference
- Customer and provider details
- Booking date, time, location
- Status (pending, confirmed, completed, cancelled)

### User
- Firebase UID
- Email, display name, photo URL
- Role (customer, provider, both)
- Address and contact information

### Review
- Service and user references
- Rating (1-5 stars)
- Comment and timestamp

---

## 🔗 **Related Links**

- **Production API:** https://hero-home-server-five.vercel.app
- **API Documentation:** [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
- **Client Repository:** [hero-home-client](../hero-home-client)
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Firebase Console:** https://console.firebase.google.com
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## 📝 **License**

ISC

---

## 👥 **Author**

**Rafi**
- GitHub: [@rafi1105](https://github.com/rafi1105)

---

## 🙏 **Acknowledgments**

- Express.js for the robust web framework
- MongoDB for flexible data storage
- Firebase for authentication services
- Vercel for serverless deployment platform
