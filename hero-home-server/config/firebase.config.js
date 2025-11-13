import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  try {
    // Check if already initialized
    if (admin.apps.length === 0) {
      // Option 1: Use base64 encoded service account from environment variable
      if (process.env.FIREBASE_SERVICE_KEY) {
        try {
          const decoded = Buffer.from(process.env.FIREBASE_SERVICE_KEY, "base64").toString("utf8");
          const serviceAccount = JSON.parse(decoded);
          
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
          
          console.log('✅ Firebase Admin SDK initialized with base64 encoded service account');
          return;
        } catch (decodeError) {
          console.warn('⚠️ Could not decode FIREBASE_SERVICE_KEY, trying file...');
        }
      }
      
      // Option 2: Use service account JSON file (most reliable)
      try {
        const serviceAccountPath = join(__dirname, '..', 'herohome-e9276-firebase-adminsdk-fbsvc-a4fa428247.json');
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        
        console.log('✅ Firebase Admin SDK initialized with service account file');
        return;
      } catch (fileError) {
        console.warn('⚠️ Could not load service account file, trying environment variables...');
      }
      
      // Option 3: Use environment variables
      if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          })
        });
        
        console.log('✅ Firebase Admin SDK initialized with environment variables');
      } else {
        throw new Error('Missing Firebase credentials. Please check your .env file or service account JSON.');
      }
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
    throw error;
  }
};

initializeFirebaseAdmin();

export default admin;
