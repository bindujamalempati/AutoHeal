import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJXfjMxG5yPugykTbDPcxoXem6HeNcWyQ",
  authDomain: "k8s-autopilot-6lf2f.firebaseapp.com",
  projectId: "k8s-autopilot-6lf2f",
  storageBucket: "k8s-autopilot-6lf2f.appspot.com",
  messagingSenderId: "829279917467",
  appId: "1:829279917467:web:d60f39f56cc85e34ed7d3e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
