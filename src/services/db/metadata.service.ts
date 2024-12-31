import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.service";

const DB_NAME = "tunedash_metadata";

const getBeatsByCoverId = async (coverId: string): Promise<number[]> => {
  const d = doc(db, DB_NAME, coverId);
  const docSnap = await getDoc(d);
  return docSnap.data()?.beats || [];
};

export { getBeatsByCoverId };
