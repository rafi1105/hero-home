# Quick Setup Guide for Advanced Features

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd hero-home-server

# Install dependencies
npm install

# Configure Firebase Admin SDK
# Create/Edit .env file and add your Firebase credentials:
```

**.env Configuration:**
```bash
# ... existing configuration ...

# Firebase Admin SDK (Choose one option)

# Option 1: Individual credentials (Recommended for development)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Option 2: Service account JSON (Recommended for production)
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

**How to get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Copy values to .env file

### 2. Frontend Setup

```bash
cd hero-home-client

# Dependencies already installed with npm install
# recharts and firebase are already in package.json
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd hero-home-server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd hero-home-client
npm run dev
```

## ✅ Testing the Features

### 1. Test Search & Filter
- Go to `/services` page
- Try searching for keywords (case-insensitive)
- Filter by category
- Results should update immediately

### 2. Test Authentication
- Login or Register a new account
- Check browser console - token should be stored in localStorage
- Make API calls - token should be included in Authorization header
- Try accessing protected routes (create service, bookings)

### 3. Test Provider Dashboard
- Login as a user
- Add at least one service via `/add-service`
- Create some test bookings (optional)
- Go to `/profile` page
- Click "Provider Dashboard" tab
- View statistics, charts, and tables

## 🔍 Verification Checklist

### Backend
- [ ] Firebase Admin SDK initialized (check server console logs)
- [ ] Protected routes require authentication
- [ ] Provider stats endpoint returns data
- [ ] Search API works with $regex

### Frontend
- [ ] Firebase token stored in localStorage after login
- [ ] Token included in API request headers
- [ ] Provider dashboard displays charts
- [ ] Search filters services correctly

## 📊 Sample Data for Testing

To see the provider dashboard in action, you need:
- At least 1 service created
- Optionally: Some bookings (with different statuses)
- Optionally: Some reviews for ratings

You can use the seed script if available, or manually create through the UI.

## 🐛 Common Issues

**Issue: "Firebase Admin SDK initialization failed"**
- Solution: Check your Firebase credentials in .env
- Verify the private key format (should have `\n` for newlines)

**Issue: "401 Unauthorized" errors**
- Solution: Ensure you're logged in
- Check if token is in localStorage
- Try logging out and back in

**Issue: "Provider Dashboard shows 'No data'"**
- Solution: Create at least one service
- Check that the userId matches between service and user

**Issue: Charts not rendering**
- Solution: Check browser console for errors
- Verify recharts is installed: `npm list recharts`
- Try clearing cache and reloading

## 📱 API Testing with Postman/Thunder Client

### Test Protected Endpoint

1. **Login to get token:**
   - Login via the UI
   - Open DevTools > Application > localStorage
   - Copy the `token` value

2. **Test Provider Stats:**
   ```
   GET https://hero-home-server-five.vercel.app/users/{userId}/provider-stats
   Headers:
   Authorization: Bearer {your-token-here}
   ```

3. **Test Search:**
   ```
   GET https://hero-home-server-five.vercel.app/services?search=plumbing
   ```

## 🎉 Success Indicators

When everything is working:
- ✅ Can login/register without errors
- ✅ Search instantly filters results
- ✅ Provider dashboard shows colorful charts
- ✅ Statistics cards display accurate numbers
- ✅ Recent bookings table populated
- ✅ Token auto-refreshes every 55 minutes
- ✅ Protected routes return 401 when not authenticated

## 📞 Support

If you encounter issues:
1. Check the `ADVANCED_FEATURES.md` for detailed documentation
2. Review server console logs
3. Check browser console for errors
4. Verify all environment variables are set correctly

---

**Happy Coding! 🚀**
