import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgC8e2_wkTnPQt_jF42JCTC6Q9C-XD1KU",
  authDomain: "herohome-e9276.firebaseapp.com",
  projectId: "herohome-e9276",
  storageBucket: "herohome-e9276.firebasestorage.app",
  messagingSenderId: "901915180843",
  appId: "1:901915180843:web:b748697c326e0a1410cf6e",
  measurementId: "G-YJ27PL6VKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
