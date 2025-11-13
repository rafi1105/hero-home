# Quick Firebase Console Setup Checklist

Use this checklist to ensure your Firebase Console is properly configured for this application.

## ✅ Pre-flight Checklist

### 1. Enable Email/Password Authentication

- [ ] Navigate to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select project: **herohome-e9276**
- [ ] Go to **Authentication** → **Sign-in method**
- [ ] Find **Email/Password** in the list
- [ ] Toggle the **Enable** switch to ON
- [ ] Click **Save**

**Status:** ⚠️ **REQUIRED** - Without this, users will see `auth/operation-not-allowed` errors

---

### 2. Enable Google Sign-In

- [ ] In **Authentication** → **Sign-in method**
- [ ] Find **Google** in the list
- [ ] Click on Google to configure
- [ ] Toggle the **Enable** switch to ON
- [ ] Select a **Project support email**
- [ ] Click **Save**

**Status:** ⚠️ **REQUIRED** - For Google authentication to work

---

### 3. Configure Authorized Domains

- [ ] In **Authentication** → **Settings** → **Authorized domains** tab
- [ ] Verify these domains are listed:
  - `localhost` ✓
  - `127.0.0.1` ✓
  - Your production domain (if deploying)

**Current domains that should be authorized:**
```
localhost
127.0.0.1
```

**Add more if needed:** Click **Add domain** button

**Status:** ⚠️ **REQUIRED** - For authentication to work on localhost

---

### 4. Verify Firebase Configuration in Code

Check that `hero-home-client/src/config/firebase.config.js` has the correct configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCgC8e2_wkTnPQt_jF42JCTC6Q9C-XD1KU",
  authDomain: "herohome-e9276.firebaseapp.com",
  projectId: "herohome-e9276",
  storageBucket: "herohome-e9276.firebasestorage.app",
  messagingSenderId: "901915180843",
  appId: "1:901915180843:web:b748697c326e0a1410cf6e",
  measurementId: "G-YJ27PL6VKZ"
};
```

- [ ] Configuration matches your Firebase project

**Status:** ✅ Already configured correctly

---

## 🔧 Optional: OAuth Consent Screen (For Production)

Only needed if deploying to production or encountering Google Sign-In issues:

### Google Cloud Console Configuration

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Select project: **herohome-e9276**
- [ ] Navigate to **APIs & Services** → **OAuth consent screen**
- [ ] Configure:
  - [ ] App name: `HomeHero` (or your preferred name)
  - [ ] User support email: (select from dropdown)
  - [ ] Developer contact email: (enter email)
- [ ] Click **Save and Continue**
- [ ] Add scopes (optional for basic auth)
- [ ] Add test users if app is in testing mode
- [ ] Click **Save**

**Status:** 📋 **OPTIONAL** for development, **REQUIRED** for production

---

## 🧪 Testing Your Configuration

After completing the checklist above, test the authentication:

### Test 1: Email/Password Registration
1. Start the app: `npm run dev`
2. Navigate to `/register`
3. Fill in registration form
4. Click "Create Account"
5. **Expected:** ✅ Success message and redirect to home
6. **If error:** Check that Email/Password is enabled in Firebase Console

### Test 2: Google Sign-In
1. Navigate to `/login`
2. Click "Continue with Google"
3. **Expected:** ✅ Google account selection popup appears
4. Select account and allow permissions
5. **Expected:** ✅ Success message and redirect to home

**If popup is blocked:**
- Browser should automatically use redirect method
- You'll be redirected to Google, then back to the app
- Still counts as successful authentication

### Test 3: Email/Password Login
1. Navigate to `/login`
2. Enter email and password from Test 1
3. Click "Login"
4. **Expected:** ✅ Success message and redirect to home

---

## ❌ Common Issues and Solutions

### Issue: `auth/operation-not-allowed`
**Solution:** Email/Password authentication is not enabled
- Go to Firebase Console → Authentication → Sign-in method
- Enable Email/Password authentication

### Issue: `auth/popup-blocked`
**Solution:** Browser is blocking popups
- The app will automatically use redirect method
- Or, allow popups for `localhost` in browser settings

### Issue: `auth/unauthorized-domain`
**Solution:** Domain not authorized
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add your domain (e.g., `localhost`)

### Issue: `auth/invalid-api-key`
**Solution:** Firebase configuration is incorrect
- Verify `firebase.config.js` matches your Firebase project settings
- Get correct config from Firebase Console → Project Settings

### Issue: Google Sign-In redirects but doesn't complete
**Solution:** Check OAuth consent screen configuration
- Ensure app is published or user is added as test user
- Verify redirect URIs are configured correctly

---

## 📝 Configuration Status

Mark each item as you complete it:

- [ ] Email/Password authentication enabled
- [ ] Google Sign-In enabled
- [ ] Authorized domains configured
- [ ] Firebase config verified
- [ ] Tested email/password registration
- [ ] Tested Google Sign-In
- [ ] Tested email/password login

---

## 🚀 Ready to Go!

Once all items are checked, your Firebase authentication should be fully functional!

**Need Help?**
- Check `FIREBASE_AUTH_FIX.md` for detailed documentation
- Review Firebase Console error messages
- Check browser console for detailed error codes
- Ensure you're running latest code: `git pull && npm install`

---

**Last Updated:** 2025-11-13
**Firebase SDK Version:** 12.5.0
**Project:** herohome-e9276
