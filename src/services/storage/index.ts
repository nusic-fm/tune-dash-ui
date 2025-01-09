import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase.service";

const uploadVoiceImage = async (voiceId: string, image: File) => {
  const storageRef = ref(storage, `voice_models/avatars/${voiceId}`);
  await uploadBytes(storageRef, image);
};

const uploadVoiceAudio = async (
  coverId: string,
  voiceId: string,
  audio: File
) => {
  const storageRef = ref(storage, `covers/${coverId}/${voiceId}.mp3`);
  await uploadBytes(storageRef, audio);
};

export { uploadVoiceAudio, uploadVoiceImage };
