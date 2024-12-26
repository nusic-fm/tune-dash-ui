import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.service";
import { updateUserDocTimestamps } from "./user.service";

type VoiceRequest = {
  coverId: string;
  coverTitle: string;
  voiceModelName: string;
  modelId: string;
  userId: string;
  userName: string;
  bounty: number;
};

const DB_NAME = "tunedash_voice_requests";

const createVoiceRequest = async (voiceRequest: VoiceRequest) => {
  const d = doc(db, DB_NAME, voiceRequest.modelId);
  await setDoc(d, voiceRequest);
  await updateUserDocTimestamps(
    voiceRequest.userId,
    "dailyVoiceRequestTimestamp"
  );
};

export { createVoiceRequest };
