import { db, logFirebaseEvent } from "../firebase.service";
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
  collection,
  onSnapshot,
} from "firebase/firestore";
import { VoiceV1Cover } from "./coversV1.service";

const DB_NAME = "tune_dash_users";

export type User = {
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
  isBot?: boolean;
  id: string;
  purchasedVoices: string[] | null;
  xp?: number;
  wins?: number;
  playedTimes?: number;
  isVip?: boolean;
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

const createUserDoc = async (
  userObj: User,
  docId: string,
  listener?: (user: User) => void
): Promise<User> => {
  const d = doc(db, DB_NAME, docId);
  if (!!listener)
    onSnapshot(d, (snapshot) => {
      listener?.(snapshot.data() as User);
    });
  const existingUser = await getDoc(d);
  if (existingUser.exists()) {
    await updateDoc(d, { lastSeen: serverTimestamp(), visits: increment(1) });
    logFirebaseEvent("login", {
      user_id: docId,
    });
    return existingUser.data() as User;
  }
  const newUserObj = {
    ...userObj,
    visits: 1,
    xp: 0,
    wins: 0,
    playedTimes: 0,
  };
  await setDoc(d, {
    ...newUserObj,
    createdAt: serverTimestamp(),
    lastSeen: serverTimestamp(),
  });
  logFirebaseEvent("sign_up", {
    user_id: docId,
  });
  return newUserObj;
};

const updatePurchasedVoice = async (userId: string, voiceId: string) => {
  const d = doc(db, DB_NAME, userId);
  await updateDoc(d, { purchasedVoices: arrayUnion(voiceId) });
};

const updateGameResult = async (
  userId: string,
  coverDocId: string,
  isWinner: boolean,
  voices: VoiceV1Cover[],
  winningVoiceId: string
) => {
  const d = doc(db, DB_NAME, userId);
  const existingUser = await getDoc(d);
  if (!existingUser.exists()) {
    // TODO: Log User not found
    return;
  }
  await updateDoc(d, {
    wins: increment(isWinner ? 1 : 0),
    playedTimes: increment(1),
    xp: increment(isWinner ? 500 : 0),
  });
  // Save game in subcollection
  const gameDoc = doc(
    collection(db, DB_NAME, userId, "races"),
    `${Date.now()}`
  );
  await setDoc(gameDoc, {
    voices,
    isWinner,
    winningVoiceId,
    timestamp: serverTimestamp(),
    coverDocId,
  });
};
export {
  createUserDoc,
  getUserDocById,
  updatePurchasedVoice,
  updateGameResult,
};
