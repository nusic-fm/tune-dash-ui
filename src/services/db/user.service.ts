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
import { hasTimestampCrossedOneDay } from "../../helpers";

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
  coins?: number;
  dailyVoiceRequestTimestamp?: Timestamp;
  level?: number;
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
      level?: number;
      // chatId?: number | null;
      // chatTitle?: string | null;
      // chatPhotoUrl?: string | null;
    } = {
      lastSeen: serverTimestamp(),
    };
    // if (!existingUserDoc.chatId && userObj.chatId) {
    //   visitObj["chatId"] = userObj.chatId;
    //   visitObj["chatTitle"] = userObj.chatTitle;
    //   visitObj["chatPhotoUrl"] = userObj.chatPhotoUrl;
    // }
    if (existingUserDoc.level === undefined) {
      visitObj["level"] = 0;
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
    level: 0,
    coins: 0,
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
  winningPositions: number[],
  xp: number,
  dash: number
) => {
  const d = doc(db, DB_NAME, userId);
  const existingUser = await getDoc(d);
  if (!existingUser.exists()) {
    // TODO: Log User not found
    return;
  }
  const userDoc = existingUser.data() as UserDoc;
  const updateObj: any = {
    wins: increment(isWinner ? 1 : 0),
    playedTimes: increment(1),
    xp: increment(xp),
    coins: increment(dash),
  };
  if (hasTimestampCrossedOneDay(userDoc.lastDailyRacePlayedTimestamp)) {
    updateObj["lastDailyRacePlayedTimestamp"] = serverTimestamp();
  }
  await updateDoc(d, updateObj);
  // Save game in subcollection
  const gameDoc = doc(
    collection(db, DB_NAME, userId, "races"),
    `${Date.now()}`
  );
  await setDoc(gameDoc, {
    voices,
    isWinner,
    winningPositions,
    xp,
    dash,
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
  | "REFERRAL"
  | "PURCHASE_DASH";

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
      return 100;
    default:
      return 0;
  }
};

const rewardCoins = async (
  userId: string,
  rewardType: RewardType,
  rewardAmount?: number
) => {
  const d = doc(db, DB_NAME, userId);
  const reward = rewardAmount ?? getRewardTokensAmount(rewardType);
  if (!reward) return;
  await updateDoc(d, { coins: increment(reward) });
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

const updateUserLevel = async (userId: string, level: number) => {
  const d = doc(db, DB_NAME, userId);
  await updateDoc(d, { level });
};

export {
  createUserDoc,
  getUserDocById,
  updatePurchasedVoice,
  updateGameResult,
  rewardCoins,
  updateUserDocTimestamps,
  updateUserLevel,
};
