import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4dNphGfsPJCFaOy2c-PH0hnBJN5m8RzI",
  authDomain: "neigborhood-watch.firebaseapp.com",
  projectId: "neigborhood-watch",
  storageBucket: "neigborhood-watch.appspot.com",
  messagingSenderId: "516332513600",
  appId: "1:516332513600:web:44b6a6ffde87319d54b2a5",
  measurementId: "G-2P6DC45698",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
