import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBMCsxfnltAKuEs6fU35DyV7SeQ5K744TI",
    authDomain: "social-media-app-541b3.firebaseapp.com",
    databaseURL: "https://social-media-app-541b3-default-rtdb.firebaseio.com",
    projectId: "social-media-app-541b3",
    storageBucket: "social-media-app-541b3.appspot.com",
    messagingSenderId: "127640857756",
    appId: "1:127640857756:web:a5198632ff4d4edc3a1159",
    measurementId: "G-8RPLHECNH6"
};
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app, auth}