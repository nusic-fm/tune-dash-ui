import { doc, increment, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase.service";
import { updateUserObj } from "./user.service";

export type VoiceRequest = {
  coverId: string;
  coverTitle: string;
  voiceModelName: string;
  modelId: string;
  userId: string;
  name: string;
  bounty: number;
  isCompleted: boolean;
  voiceId: string;
};

const DB_NAME = "tunedash_voice_requests";

const createVoiceRequest = async (voiceRequest: VoiceRequest) => {
  const d = doc(db, DB_NAME, voiceRequest.modelId);
  await setDoc(d, {
    ...voiceRequest,
    createdAt: serverTimestamp(),
  });
  await updateUserObj(voiceRequest.userId, {
    dailyVoiceRequestTimestamp: serverTimestamp(),
    coins: increment(-voiceRequest.bounty),
  });
  // await updateUserDocTimestamps(
  //   voiceRequest.userId,
  //   "dailyVoiceRequestTimestamp"
  // );
};

export { createVoiceRequest };
