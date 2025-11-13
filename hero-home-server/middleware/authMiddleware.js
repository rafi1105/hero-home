import admin from '../config/firebase.config.js';

/**
 * Middleware to verify Firebase authentication token
 * Expects token in Authorization header as "Bearer <token>"
 */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Unauthorized - No token provided',
        error: 'MISSING_TOKEN' 
      });
    }
    
    // Extract token
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Unauthorized - Invalid token format',
        error: 'INVALID_TOKEN_FORMAT' 
      });
    }
    
    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name || '',
      picture: decodedToken.picture || ''
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    // Handle different error types
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        message: 'Unauthorized - Token expired',
        error: 'TOKEN_EXPIRED' 
      });
    }
    
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ 
        message: 'Unauthorized - Invalid token',
        error: 'INVALID_TOKEN' 
      });
    }
    
    return res.status(403).json({ 
      message: 'Forbidden - Token verification failed',
      error: 'VERIFICATION_FAILED' 
    });
  }
};

/**
 * Optional middleware - verifies token if present but doesn't require it
 * Useful for routes that have different behavior for authenticated users
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      
      if (token) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          name: decodedToken.name || '',
          picture: decodedToken.picture || ''
        };
      }
    }
    
    next();
  } catch (error) {
    // Don't fail the request if optional auth fails
    console.warn('Optional auth verification failed:', error.message);
    next();
  }
};
