import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBP3ZYRM63wOznrszozYyMPZDtHkM_V2w4",
  authDomain: "dsaw-2025.firebaseapp.com",
  projectId: "dsaw-2025",
  storageBucket: "dsaw-2025.firebasestorage.app",
  messagingSenderId: "356988906929",
  appId: "1:356988906929:web:2ba4b5be8529a6401f6190"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
