const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const firebaseConfig = {
    apiKey: "AIzaSyCSHuBdH0ZYTNoMNdN8yTEWTbeHJzzUD9s",
    authDomain: "e-gram-panchayat-e0d6b.firebaseapp.com",
    projectId: "e-gram-panchayat-e0d6b",
    storageBucket: "e-gram-panchayat-e0d6b.firebasestorage.app",
    messagingSenderId: "51524069450",
    appId: "1:51524069450:web:5a1d161734351e8bc21eb3",
    measurementId: "G-WXSJ9QMCV6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getToken() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, "admin1@example.com", "Password123");
    const token = await userCredential.user.getIdToken();
    console.log("ID Token:\n", token);
  } catch (err) {
    console.error("Error getting token", err.message);
  }
}

getToken();
