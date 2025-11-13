# 🏠 Hero Home Client

Frontend application for Hero Home - a platform connecting users with local service providers.

---

## 🚀 **Live Deployment**

**Production App:**
```
https://herohome-e9276.web.app/
```

**Firebase Hosting URL:**
```
https://herohome-e9276.firebaseapp.com/
```

## Technologies Used

- **React 19.2.0** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Tailwind CSS 4.1.17** - Utility-first CSS
- **Framer Motion** - Animation library
- **Firebase Authentication** - User authentication
- **Axios** - HTTP client
- **Swiper** - Modern slider
- **React Icons** - Icon library
- **React Toastify** - Toast notifications

## Features

### Pages
- **Home** - Hero slider, featured services, testimonials
- **Services** - Browse all services with search and filters
- **Login** - Email/password and Google authentication
- **Register** - New user registration
- **Profile** - User profile management
- **My Services** (Provider) - Manage your services
- **Add Service** (Provider) - Create new service
- **My Bookings** - View and manage bookings

### Components
- **Header** - Responsive navigation with dark mode toggle
- **Footer** - Links, contact info, social media
- **Switch** - Animated dark mode toggle
- **SearchInput** - Animated search with filters
- **Checkbox** - Custom checkbox with animation
- **Loader** - Loading spinner
- **PrivateRoute** - Protected route wrapper

### Features
- 🔐 Firebase authentication (email/password + Google)
- 🌙 Dark mode with localStorage persistence
- 📱 Fully responsive design
- ✨ Framer Motion animations
- 🎨 Custom styled components
- 🔍 Service search and filtering
- ⭐ Rating and review system
- 📅 Booking management

## 📋 **Prerequisites**

Before installation, ensure you have:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (comes with Node.js)
- **Firebase CLI** - For deployment
- **Git** - Version control

---

## 📦 **Installation**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rafi1105/hero-home.git
cd hero-home/hero-home-client
```

### 2️⃣ Install Dependencies

```bash
npm install
```

**Key Dependencies:**
- `react` (19.2.0) - UI library
- `react-router-dom` - Client-side routing
- `firebase` - Authentication & hosting
- `axios` - HTTP client
- `styled-components` - CSS-in-JS
- `framer-motion` - Animations
- `react-toastify` - Notifications

### 3️⃣ Environment Configuration

The app uses Firebase configuration stored in `src/config/firebase.config.js`:

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

### 4️⃣ Update API URL

Update the backend API URL in `src/services/api.js`:

```javascript
const API_URL = 'https://hero-home-server-five.vercel.app/api';
```

---

## 🏃 **Running Locally**

### Development Mode

```bash
npm run dev
```

The app will run on: `http://localhost:5173`

### Production Build

```bash
npm run build
```

Build output in: `dist/`

### Preview Production Build

```bash
npm run preview
```

---

## 🔥 **Firebase Deployment**

### 1️⃣ Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2️⃣ Login to Firebase

```bash
firebase login
```

This opens a browser window for Google authentication.

### 3️⃣ Initialize Firebase (First Time Only)

```bash
firebase init
```

**Configuration prompts:**

1. **Features to set up:**
   - Select: `Hosting: Configure files for Firebase Hosting`
   - Use arrow keys and spacebar to select

2. **Project setup:**
   - Select: `Use an existing project`
   - Choose: `herohome-e9276`

3. **Hosting setup:**
   - **Public directory:** `dist` (not `public`)
   - **Configure as single-page app:** `Yes`
   - **Set up automatic builds with GitHub:** `No`
   - **Overwrite index.html:** `No`

This creates:
- `.firebaserc` - Project configuration
- `firebase.json` - Hosting configuration

### 4️⃣ Build the Application

```bash
npm run build
```

This creates the production build in the `dist/` folder.

### 5️⃣ Deploy to Firebase

```bash
firebase deploy
```

**Deployment Output:**
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/herohome-e9276/overview
Hosting URL: https://herohome-e9276.web.app
```

### 6️⃣ Access Your Deployment

After deployment:
- **Live Site:** https://herohome-e9276.web.app/
- **Firebase Console:** https://console.firebase.google.com/project/herohome-e9276
- **Firebase Hosting:** View hosting details in console

---

## 🔄 **Redeployment Process**

For future updates:

```bash
# 1. Make your changes to the code
# 2. Build the production version
npm run build

# 3. Deploy to Firebase
firebase deploy
```

**Quick Deploy Script:**
```bash
npm run build && firebase deploy
```

---

## 📱 **Firebase Hosting Features**

### Automatic SSL/HTTPS
- Firebase provides free SSL certificates
- All traffic automatically served over HTTPS

### CDN Distribution
- Global content delivery network
- Fast loading times worldwide

### Custom Domain (Optional)
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps

### Hosting Commands

```bash
# Deploy
firebase deploy

# Deploy with preview channel
firebase hosting:channel:deploy preview

# View previous deployments
firebase hosting:clone

# Delete hosting site
firebase hosting:disable
```

---

## 🔐 **Firebase Authentication**

The app uses Firebase Authentication for:
- Email/Password authentication
- Google Sign-In
- User session management

## Project Structure

```
hero-home-client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Switch.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   └── Loader.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   └── PrivateRoute.jsx
│   ├── config/
│   │   └── firebase.config.js
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── MyServices.jsx
│   │   ├── AddService.jsx
│   │   └── MyBookings.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 📜 **Available Scripts**

### Development

```bash
npm run dev
```
Runs the app in development mode on `http://localhost:5173`

### Build

```bash
npm run build
```
Builds the app for production to the `dist` folder
- Minifies code
- Optimizes assets
- Tree-shakes unused code

### Preview

```bash
npm run preview
```
Preview the production build locally before deployment

### Lint

```bash
npm run lint
```
Run ESLint to check code quality and standards

---

## 🔧 **Configuration Files**

### `firebase.json`
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### `.firebaserc`
```json
{
  "projects": {
    "default": "herohome-e9276"
  }
}
```

### `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
})
```

## Authentication Flow

1. User registers with email/password or Google
2. Firebase creates authentication
3. User data synced with MongoDB backend
4. JWT token for API requests
5. Protected routes require authentication

## Dark Mode

Toggle dark mode using the Switch component in the header. The preference is saved to localStorage and persists across sessions.

## Service Categories

- Plumbing
- Electrical
- Cleaning
- HVAC
- Carpentry
- Painting
- Gardening
- Pest Control

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌐 **Browser Support**

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔗 **API Integration**

### Backend Server
```
https://hero-home-server-five.vercel.app/api
```

### API Endpoints Used
- `GET /services` - Fetch all services
- `GET /services/top-rated` - Top rated services
- `POST /services` - Create service (protected)
- `GET /bookings/user/:userId` - User bookings (protected)
- `POST /bookings` - Create booking (protected)
- `POST /users` - Register user

**Authentication:** Firebase token in `Authorization: Bearer <token>` header

---

## 🐛 **Troubleshooting**

### Build Errors

**Error:** `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase Deployment Issues

**Error:** `Firebase CLI not found`
```bash
# Install globally
npm install -g firebase-tools
```

**Error:** `Hosting site not found`
```bash
# Reinitialize Firebase
firebase init hosting
```

### API Connection Issues

**Error:** `Network Error` or CORS
- Verify backend URL is correct
- Check backend is deployed and running
- Verify Firebase authentication token is valid

### Authentication Issues

**Error:** `Firebase Auth not initialized`
- Check `firebase.config.js` has correct project credentials
- Verify Firebase project is active in console

---

## 📊 **Performance Optimization**

### Build Optimization
- Code splitting with React.lazy
- Tree shaking removes unused code
- Asset optimization (images, fonts)
- Minification and compression

### Firebase Hosting
- Global CDN distribution
- HTTP/2 support
- Automatic Brotli compression
- Image optimization

### Lighthouse Scores
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 90+

---

## 🔗 **Related Links**

- **Live App:** https://herohome-e9276.web.app/
- **Backend API:** https://hero-home-server-five.vercel.app
- **Firebase Console:** https://console.firebase.google.com/project/herohome-e9276
- **GitHub Repository:** https://github.com/rafi1105/hero-home
- **Server Documentation:** [hero-home-server/README.md](../hero-home-server/README.md)

---

## 📝 **License**

ISC

---

## 👥 **Author**

**Rafi**
- GitHub: [@rafi1105](https://github.com/rafi1105)

---

## 🙏 **Acknowledgments**

- React team for the amazing library
- Vite for blazing fast build tool
- Firebase for hosting and authentication
- Styled Components for CSS-in-JS
- Framer Motion for smooth animations

