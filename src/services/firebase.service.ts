// Import the functions you need from the SDKs you need
// import { getStripePayments } from "@stripe/firestore-stripe-payments";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, logEvent, setUserId } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getStripePayments } from "@invertase/firestore-stripe-payments";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

const setUserIdForAnalytics = (userId: string) => {
  setUserId(analytics, userId);
};

const logFirebaseEvent = (
  type:
    | "audio_interaction"
    | "start_from_landing_page"
    | "menu_selection"
    | "track_playback"
    | "track_selection"
    | "voice_selection"
    | "choose_opponent"
    | "opponent_voice_selection"
    | "voice_purchase_attempt"
    | "voice_purchase_success"
    | "voice_purchase_failure"
    | "race_start"
    | "race_end"
    | "race_again"
    | "new_race"
    | "race_result"
    | "sign_up"
    | "login"
    | "dash_purchase_attempt"
    | "dash_purchase_success"
    | "dash_purchase_failure",
  additionalParams: any
) => {
  logEvent(analytics, type as any, additionalParams);
};

export {
  app,
  auth,
  logFirebaseEvent,
  db,
  storage,
  analytics,
  setUserIdForAnalytics,
};
