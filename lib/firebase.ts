import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore with settings for better performance
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  cacheSizeBytes: 1048576, // 1MB
});

const storage = getStorage(app);

export { app, auth, db, storage };
