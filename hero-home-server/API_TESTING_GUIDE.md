# 🧪 Hero Home API Testing Guide

## 🌐 Base URLs

**Local Development:**
```
http://localhost:5000
```

**Production (Vercel):**
```
https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app
```

---

## ✅ Public Routes (No Authentication Required)

### 1️⃣ Health Checks

```bash
# Root health check
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/

# API health check
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Hero Home API is running",
  "version": "1.0.0"
}
```

---

### 2️⃣ Services - Public Endpoints

#### Get All Services
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services
```

#### Get Top Rated Services
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services/top-rated
```

#### Filter by Category
```bash
curl "https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services?category=plumbing"
```

#### Filter by Price Range
```bash
curl "https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services?minPrice=20&maxPrice=100"
```

#### Search Services
```bash
curl "https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services?search=repair"
```

#### Get Single Service
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services/{SERVICE_ID}
```

---

### 3️⃣ Users - Public Endpoints

#### Create User (Registration)
```bash
curl -X POST https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid": "firebase-uid-123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "customer"
  }'
```

---

### 4️⃣ Reviews - Public Endpoints

#### Get All Reviews
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/reviews
```

#### Get Review by ID
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/reviews/{REVIEW_ID}
```

#### Get Service Reviews
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/reviews/service/{SERVICE_ID}
```

---

## 🔒 Protected Routes (Require Authentication)

These routes require a Firebase authentication token in the `Authorization` header:

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

### 1️⃣ Services - Protected Endpoints

#### Create Service
```bash
curl -X POST https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Professional Plumbing",
    "category": "plumbing",
    "description": "Expert plumbing services",
    "price": 75,
    "provider": {
      "userId": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "verified": true
    }
  }'
```

#### Update Service
```bash
curl -X PUT https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services/{SERVICE_ID} \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 85,
    "available": true
  }'
```

#### Delete Service
```bash
curl -X DELETE https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services/{SERVICE_ID} \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

#### Get My Services
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services/user/{USER_ID} \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

#### Add Review to Service
```bash
curl -X POST https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/services/{SERVICE_ID}/review \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "userName": "Alice Brown",
    "bookingId": "booking-id",
    "rating": 5,
    "comment": "Excellent service!"
  }'
```

---

### 2️⃣ Bookings - All Protected

#### Get All Bookings
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/bookings \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

#### Create Booking
```bash
curl -X POST https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/bookings \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "service": "SERVICE_ID",
    "customer": {
      "userId": "customer-123",
      "name": "Alice Brown",
      "email": "alice@example.com"
    },
    "provider": {
      "userId": "provider-123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "bookingDate": "2025-11-20",
    "bookingTime": "10:00 AM",
    "location": {
      "address": "123 Main St, City, State 12345"
    },
    "price": 75,
    "notes": "Please call before arriving"
  }'
```

#### Get User Bookings
```bash
curl "https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/bookings/user/{USER_ID}" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

#### Get Provider Bookings
```bash
curl "https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/bookings/provider/{USER_ID}" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

#### Update Booking Status
```bash
curl -X PUT https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/bookings/{BOOKING_ID}/status \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

#### Cancel Booking
```bash
curl -X PUT https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/bookings/{BOOKING_ID}/cancel \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Customer cancelled",
    "cancelledBy": "customer-123"
  }'
```

---

### 3️⃣ Users - Protected Endpoints

#### Get All Users
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/users \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

#### Get User by ID
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/users/{USER_ID} \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

#### Update User
```bash
curl -X PUT https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/users/{USER_ID} \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "555-1234",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'
```

#### Get Provider Stats
```bash
curl https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/users/{USER_ID}/provider-stats \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

### 4️⃣ Reviews - Protected Endpoints

#### Create Review
```bash
curl -X POST https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "service": "SERVICE_ID",
    "user": "USER_ID",
    "rating": 5,
    "comment": "Great service!"
  }'
```

#### Update Review
```bash
curl -X PUT https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/reviews/{REVIEW_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Updated review"
  }'
```

#### Delete Review
```bash
curl -X DELETE https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app/api/reviews/{REVIEW_ID}
```

---

## ⚠️ Common Errors

### 401 Unauthorized - No token provided
```json
{
  "message": "Unauthorized - No token provided",
  "error": "MISSING_TOKEN"
}
```
**Solution:** Add `Authorization: Bearer YOUR_FIREBASE_TOKEN` header

### 404 Not Found
```json
{
  "message": "Route not found"
}
```
**Solution:** Check the route path - ensure `/api/` prefix is included

### 400 Bad Request - Validation Error
```json
{
  "message": "Service validation failed: category: `invalid` is not a valid enum value"
}
```
**Solution:** Check request body matches model requirements

---

## 🧪 Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="https://hero-home-server-bco2sqiqa-rafis-projects-f7e1e467.vercel.app"

echo "🧪 Testing Hero Home API"
echo "========================"

echo ""
echo "✅ Testing Public Routes..."

echo "1. Health Check:"
curl -s "$BASE_URL/" | jq

echo ""
echo "2. Get Services:"
curl -s "$BASE_URL/api/services" | jq '. | length'

echo ""
echo "3. Get Top Rated:"
curl -s "$BASE_URL/api/services/top-rated" | jq '. | length'

echo ""
echo "❌ Testing Protected Routes (Should Fail)..."

echo "4. Get Bookings (No Auth):"
curl -s "$BASE_URL/api/bookings" | jq

echo ""
echo "========================"
echo "✅ Test Complete!"
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🔑 Getting Firebase Token

To test protected routes, you need a Firebase authentication token:

1. **Login to your app** through the client
2. **Open browser console** and run:
   ```javascript
   localStorage.getItem('token')
   ```
3. **Copy the token** and use it in API calls

Or use Firebase Admin SDK to create a custom token:
```javascript
import admin from 'firebase-admin';
const token = await admin.auth().createCustomToken('user-id');
```

---

## 📊 Expected Status Codes

- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Token valid but insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Database connection failed
