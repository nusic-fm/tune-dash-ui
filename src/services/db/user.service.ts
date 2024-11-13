import { db } from "../firebase.service";
import {
  doc,
  serverTimestamp,
  // setDoc,
  // getDoc,
  // setDoc,
  updateDoc,
  getDoc,
  Timestamp,
  setDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";

const DB_NAME = "tune_dash_users";

export type User = {
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
  isBot?: boolean;
  id: string;
};
export type UserDoc = User & {
  createdAt: Timestamp;
  lastSeen: Timestamp;
  visits: number;
};

const getUserDocById = async (docId: string) => {
  const d = doc(db, DB_NAME, docId);
  return (await getDoc(d)).data() as UserDoc;
};

const createUserDoc = async (userObj: User, docId: string): Promise<void> => {
  const d = doc(db, DB_NAME, docId);
  const existingUser = await getDoc(d);
  if (existingUser.exists()) {
    await updateDoc(d, { lastSeen: serverTimestamp(), visits: increment(1) });
    return;
  }
  await setDoc(d, {
    ...userObj,
    createdAt: serverTimestamp(),
    lastSeen: serverTimestamp(),
    visits: 1,
  });
};

const updatePurchasedVoice = async (userId: string, voiceId: string) => {
  const d = doc(db, DB_NAME, userId);
  await updateDoc(d, { purchasedVoices: arrayUnion(voiceId) });
};
export { createUserDoc, getUserDocById, updatePurchasedVoice };
