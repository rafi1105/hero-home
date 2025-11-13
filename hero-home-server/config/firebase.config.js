import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  try {
    // Check if already initialized
    if (admin.apps.length === 0) {
      // For production: Use service account JSON file
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } 
      // For development: Use individual credentials
      else if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
          })
        });
      }
      // Fallback: Initialize without credentials (will use default credentials)
      else {
        console.warn('⚠️ Firebase Admin SDK initialized without credentials');
        admin.initializeApp();
      }
      
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
  }
};

initializeFirebaseAdmin();

export default admin;
