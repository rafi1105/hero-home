import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  };

  // Sign in with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Add custom parameters to improve the sign-in experience
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      // Try popup first
      return await signInWithPopup(auth, provider);
    } catch (error) {
      // If popup is blocked or fails due to COOP, fall back to redirect
      if (
        error.code === 'auth/popup-blocked' || 
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        console.log('Popup blocked, using redirect method instead');
        return await signInWithRedirect(auth, provider);
      }
      // Re-throw other errors
      throw error;
    }
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = (updates) => {
    return updateProfile(auth.currentUser, updates);
  };

  useEffect(() => {
    // Check for redirect result on mount
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User successfully signed in with redirect
          console.log('Successfully signed in with redirect');
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };
    
    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Get and store Firebase ID token
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('token', token);
          
          // Refresh token every 55 minutes (tokens expire after 1 hour)
          const refreshInterval = setInterval(async () => {
            try {
              const freshToken = await user.getIdToken(true);
              localStorage.setItem('token', freshToken);
            } catch (error) {
              console.error('Error refreshing token:', error);
            }
          }, 55 * 60 * 1000); // 55 minutes
          
          // Cleanup interval on component unmount
          return () => clearInterval(refreshInterval);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        localStorage.removeItem('token');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
