// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvxJutiXBPeGGrWnFO80szP6AmHqIlh3Q",
  authDomain: "redpandas-5f110.firebaseapp.com",
  projectId: "redpandas-5f110",
  storageBucket: "redpandas-5f110.appspot.com",
  messagingSenderId: "783573840695",
  appId: "1:783573840695:web:cef81050acc29242dae0b2",
  measurementId: "G-DBEWS93FX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);