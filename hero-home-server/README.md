# Hero Home Server

Backend API for HomeHero - a platform connecting users with local service providers.

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## Installation

1. **Navigate to server directory**
```bash
cd hero-home-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy the example env file
copy .env.example .env

# Edit .env and update the following:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - PORT: Server port (default: 5000)
```

4. **Start MongoDB**

For local MongoDB:
```bash
# Make sure MongoDB is running on your machine
# Default: mongodb://localhost:27017
```

For MongoDB Atlas (cloud):
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in `.env`

5. **Run the server**

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Services

- `GET /api/services` - Get all services (with filters)
  - Query params: `category`, `search`, `limit`, `page`
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create a new service
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service
- `GET /api/services/user/:userId` - Get services by provider

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel a booking
- `GET /api/bookings/user/:userId` - Get user bookings
  - Query params: `status`

### Reviews

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review
- `GET /api/reviews/service/:serviceId` - Get reviews for a service

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Database Models

### Service
- name, category, description, price
- provider (userId, name, email, verified)
- available, rating, bookingCount

### Booking
- service, customer, provider
- bookingDate, bookingTime, location
- status (pending, confirmed, in-progress, completed, cancelled)

### Review
- service, customer (userId, name, email)
- rating (1-5), comment
- verifiedBooking

### User
- firebaseUid, email, displayName
- role (customer, provider, admin)
- profile info, preferences

## Project Structure

```
hero-home-server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── serviceController.js
│   ├── bookingController.js
│   ├── reviewController.js
│   └── userController.js
├── models/
│   ├── Service.js
│   ├── Booking.js
│   ├── Review.js
│   └── User.js
├── routes/
│   ├── serviceRoutes.js
│   ├── bookingRoutes.js
│   ├── reviewRoutes.js
│   └── userRoutes.js
├── server.js              # Entry point
├── .env.example
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/herohome |
| JWT_SECRET | Secret key for JWT | - |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

## Error Handling

All endpoints return JSON responses:

Success:
```json
{
  "data": {...}
}
```

Error:
```json
{
  "message": "Error description"
}
```

## Development

Install nodemon globally for development:
```bash
npm install -g nodemon
```

Then run:
```bash
npm run dev
```

The server will automatically restart when you make changes.

## Notes

- Make sure MongoDB is running before starting the server
- Update `.env` file with your actual credentials
- The server runs on `http://localhost:5000` by default
- CORS is configured to allow requests from `http://localhost:5173` (Vite dev server)
