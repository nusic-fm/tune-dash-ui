import {
  setDoc,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.service";
import { nameToSlug } from "../../helpers";

export type VoiceModel = {
  name: string;
  id: string;
  slug: string;
  url: string;
  modelUrl: string;
  modelName: string;
};
const DB_NAME = "tunedash_voice_models";
export const getVoiceModelDocs = async (id: string) => {
  const docRef = query(
    collection(db, DB_NAME),
    where("name", "array-contains", id)
  );
  const docSnap = await getDocs(docRef);
  return docSnap.docs.map((doc) => doc.data() as VoiceModel);
};

export const createVoiceModel = async (id: string, name: string) => {
  const d = doc(db, DB_NAME, id);
  const docSnap = await getDoc(d);
  if (docSnap.exists()) {
    return;
  }
  await setDoc(d, {
    name,
    slug: id,
    createdAt: serverTimestamp(),
  });
};
