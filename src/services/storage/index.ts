import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.service";

const uploadAudioMp3 = async (id: string, audio: File) => {
  const storageRef = ref(storage, `covers/${id}/audio.mp3`);
  await uploadBytes(storageRef, audio);
};

const uploadInstrumentalMp3 = async (id: string, instrumental: File) => {
  const storageRef = ref(storage, `covers/${id}/instrumental.mp3`);
  await uploadBytes(storageRef, instrumental);
};

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

const checkIfPathExists = async (path: string) => {
  const storageRef = ref(storage, path);
  const exists = await getDownloadURL(storageRef);
  return exists;
};

export {
  uploadAudioMp3,
  uploadInstrumentalMp3,
  uploadVoiceAudio,
  uploadVoiceImage,
  checkIfPathExists,
};
