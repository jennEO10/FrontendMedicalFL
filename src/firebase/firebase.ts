import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCwnSlAKiDo4Z8b0PcMHGPJoc7ONxdj7aQ",
  authDomain: "graphic-brook-404722.firebaseapp.com",
  projectId: "graphic-brook-404722",
  storageBucket: "graphic-brook-404722.firebasestorage.app",
  messagingSenderId: "183665356909",
  appId: "1:183665356909:web:77e80c14002d63e9f9cf64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("❌ Error configurando persistencia:", error);
});

const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
