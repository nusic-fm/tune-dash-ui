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
  FieldValue,
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
  chatId: number | null;
  chatTitle: string | null;
  chatPhotoUrl: string | null;
};
export type UserDoc = User & {
  createdAt: Timestamp;
  lastSeen: Timestamp;
  lastDailyRacePlayedTimestamp?: Timestamp;
  lastDailyCheckInTimestamp?: Timestamp;
  inGameTokensCount?: number;
  dailyVoiceRequestTimestamp?: Timestamp;
};

const getUserDocById = async (docId: string) => {
  const d = doc(db, DB_NAME, docId);
  return (await getDoc(d)).data() as UserDoc;
};

const createUserDoc = async (
  userObj: User,
  docId: string,
  listener?: (user: UserDoc) => void
): Promise<User> => {
  const d = doc(db, DB_NAME, docId);
  if (!!listener)
    onSnapshot(d, (snapshot) => {
      listener?.(snapshot.data() as UserDoc);
    });
  const existingUser = await getDoc(d);
  if (existingUser.exists()) {
    const existingUserDoc = existingUser.data() as UserDoc;
    const visitObj: {
      lastSeen: FieldValue;
      chatId?: number | null;
      chatTitle?: string | null;
      chatPhotoUrl?: string | null;
    } = {
      lastSeen: serverTimestamp(),
    };
    if (!existingUserDoc.chatId && userObj.chatId) {
      visitObj["chatId"] = userObj.chatId;
      visitObj["chatTitle"] = userObj.chatTitle;
      visitObj["chatPhotoUrl"] = userObj.chatPhotoUrl;
    }
    await updateDoc(d, visitObj);
    logFirebaseEvent("login", {
      user_id: docId,
    });
    return existingUserDoc;
  }
  const newUserObj = {
    ...userObj,
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

type RewardType =
  | "DAILY_CHECK_IN"
  | "WATCH_AD"
  | "CONNECT_TON"
  | "PLAY_DAILY_RACE"
  | "PLAY_CHALLENGE"
  | "BONUS"
  | "REFERRAL";

export const getRewardTokensAmount = (rewardType: RewardType) => {
  switch (rewardType) {
    case "DAILY_CHECK_IN":
      return 10;
    case "WATCH_AD":
      return 10;
    case "CONNECT_TON":
      return 100;
    case "PLAY_DAILY_RACE":
      return 15;
    case "PLAY_CHALLENGE":
      return 30;
    case "BONUS":
      return 50;
    case "REFERRAL":
      return 10015;
  }
};

const rewardInGameTokens = async (
  userId: string,
  rewardType:
    | "DAILY_CHECK_IN"
    | "WATCH_AD"
    | "CONNECT_TON"
    | "PLAY_DAILY_RACE"
    | "PLAY_CHALLENGE"
    | "BONUS"
    | "REFERRAL"
) => {
  const d = doc(db, DB_NAME, userId);
  const reward = getRewardTokensAmount(rewardType);
  await updateDoc(d, { inGameTokensCount: increment(reward) });
};

const updateUserDocTimestamps = async (
  userId: string,
  props:
    | "lastAdWatchedTimestamp"
    | "lastDailyRacePlayedTimestamp"
    | "dailyVoiceRequestTimestamp"
) => {
  const d = doc(db, DB_NAME, userId);
  await updateDoc(d, { [props]: serverTimestamp() });
};

export {
  createUserDoc,
  getUserDocById,
  updatePurchasedVoice,
  updateGameResult,
  rewardInGameTokens,
  updateUserDocTimestamps,
};
