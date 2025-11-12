# HomeHero Client

Frontend application for HomeHero - a platform connecting users with local service providers.

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

## Installation

1. **Navigate to client directory**
```bash
cd hero-home-client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Firebase Configuration

The app uses Firebase for authentication. Configuration is in `src/config/firebase.config.js`.

## Backend Connection

Update the API base URL in `src/services/api.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
```

Make sure the backend server is running before using the app.

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

## Available Scripts

### `npm run dev`
Runs the app in development mode on `http://localhost:5173`

### `npm run build`
Builds the app for production to the `dist` folder

### `npm run preview`
Preview the production build locally

### `npm run lint`
Run ESLint to check code quality

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

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

