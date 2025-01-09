import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase.service";

const uploadVoiceImage = async (
  coverId: string,
  voiceId: string,
  image: File
) => {
  const storageRef = ref(
    storage,
    `voice_models/avatars/${coverId}/${voiceId}.jpg`
  );
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
