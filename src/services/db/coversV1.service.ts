import { db } from "../firebase.service";
import {
  addDoc,
  // arrayUnion,
  collection,
  doc,
  serverTimestamp,
  // setDoc,
  // getDoc,
  // setDoc,
  updateDoc,
  increment,
  runTransaction,
  getDoc,
  Timestamp,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

const DB_NAME = "tunedash_covers";

type ShareInfo = {
  id: string;
  avatar: string;
  name: string;
};
type Comment = {
  content: string;
  timeInAudio: number;
  shareInfo: ShareInfo;
  voiceId: string;
};
export type VoiceV1Cover = {
  url?: string;
  creatorName?: string;
  name: string;
  id: string;
  imageUrl?: string;
  shareInfo?: ShareInfo;
  avatarPath?: string;
};
export type CoverV1 = {
  bpm: number;
  duration: number;
  isReady: boolean;
  voices: VoiceV1Cover[];
  title: string;
  vocalsStartOffset: number;
  vocalsEndOffset: number;
  shareInfo: ShareInfo;
  audioUploaded?: boolean;
  instrumentalUploaded?: boolean;
  beatsUploaded?: boolean;

  audioUrl?: string;
  metadata?: {
    channelId: string;
    channelTitle: string;
    channelDescription?: string;
    channelThumbnail?: string;
    videoThumbnail: string;
    videoName: string;
    videoDescription?: string;
  };
  //   avatarUrl: string;
  vid?: string;
  sections?: { name: string; start: number }[];
  error?: string;
  stemsReady?: boolean;
  comments?: Comment[];
  likes?: {
    [id: string]: number;
    total: number;
  };
  commentsCount?: number;
  disLikes?: {
    [id: string]: number;
    total: number;
  };
  totalLikesValue?: number;
  playCount?: number;
  rank?: number;
  prevRank?: number;
  createdAt?: Timestamp;
};
export type CoverV1Doc = CoverV1 & {
  id: string;
};
const getCoverDocById = async (docId: string): Promise<CoverV1Doc> => {
  const d = doc(db, DB_NAME, docId);
  return (await getDoc(d)).data() as CoverV1Doc;
};

const createCoverV1Doc = async (coverObj: CoverV1): Promise<string> => {
  const d = collection(db, DB_NAME);
  const ref = await addDoc(d, { ...coverObj, createdAt: serverTimestamp() });
  return ref.id;
};
const updateCoverV1Doc = async (
  id: string,
  coverObj: Partial<CoverV1>
): Promise<void> => {
  const d = doc(db, DB_NAME, id);
  await updateDoc(d, { ...coverObj, updatedAt: serverTimestamp() });
};

const SUB_COLLECTION = "comments";

const addCommentToCover = async (id: string, commentInfo: Comment) => {
  await runTransaction(db, async (transaction) => {
    const collectionDocRef = doc(collection(db, DB_NAME, id, SUB_COLLECTION));
    transaction.set(collectionDocRef, {
      ...commentInfo,
      createdAt: serverTimestamp(),
    });
    // await addDoc(c, { ...commentInfo, createdAt: serverTimestamp() });
    const d = doc(db, DB_NAME, id);
    transaction.update(d, { commentsCount: increment(1) });
  });
};

const getPendingCoverFromUserId = async (
  userId: string
): Promise<CoverV1Doc | null> => {
  const q = query(
    collection(db, DB_NAME),
    where("shareInfo.id", "==", userId),
    where("isReady", "==", false),
    limit(1)
  );
  const ref = await getDocs(q);
  if (ref.docs.length === 0) {
    return null;
  }
  return { ...ref.docs[0].data(), id: ref.docs[0].id } as CoverV1Doc;
};
export {
  createCoverV1Doc,
  updateCoverV1Doc,
  addCommentToCover,
  getCoverDocById,
  getPendingCoverFromUserId,
  // addToDisLikes,
  // addToLikes,
};
