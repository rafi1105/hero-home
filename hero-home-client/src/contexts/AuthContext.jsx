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
  const [error, setError] = useState(null);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google (with popup and redirect fallback)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      // Try popup first
      return await signInWithPopup(auth, provider);
    } catch (error) {
      // If popup fails due to CORP or browser blocking, use redirect
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        console.log('Popup blocked, using redirect method...');
        return await signInWithRedirect(auth, provider);
      }
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      localStorage.removeItem('token');
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
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
    let tokenRefreshInterval;

    // Handle redirect result on component mount
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('Redirect sign-in successful');
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error);
        setError(error);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        
        // Clear any existing interval
        if (tokenRefreshInterval) {
          clearInterval(tokenRefreshInterval);
        }
        
        // Get and store Firebase ID token
        if (user) {
          try {
            const token = await user.getIdToken();
            localStorage.setItem('token', token);
            
            // Refresh token every 55 minutes (tokens expire after 1 hour)
            tokenRefreshInterval = setInterval(async () => {
              try {
                const freshToken = await user.getIdToken(true);
                localStorage.setItem('token', freshToken);
              } catch (error) {
                console.error('Error refreshing token:', error);
                // Clear interval if refresh fails
                clearInterval(tokenRefreshInterval);
              }
            }, 55 * 60 * 1000); // 55 minutes
          } catch (error) {
            console.error('Error getting token:', error);
            localStorage.removeItem('token');
          }
        } else {
          localStorage.removeItem('token');
        }
        
        setError(null);
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      // Error callback for onAuthStateChanged
      console.error('Auth state observer error:', error);
      setError(error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
    updateUserProfile,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
