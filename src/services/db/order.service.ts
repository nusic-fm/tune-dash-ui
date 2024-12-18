import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { VoiceV1Cover } from "./coversV1.service";
import { db } from "../firebase.service";
import { StoreItem } from "../../components/TaskListDialog";

const DB_NAME = "tune_dash_orders";

const createOrder = async (
  userId: string,
  cost: number,
  voiceInfo: VoiceV1Cover | null = null,
  storeItem: StoreItem | null = null
): Promise<string> => {
  const col = collection(db, DB_NAME);
  const docRef = await addDoc(col, {
    userId,
    voiceInfo,
    storeItem,
    cost,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

const updateOrder = async (
  orderId: string,
  status: "success" | "pending" | "failed"
) => {
  const docRef = doc(db, DB_NAME, orderId);
  await updateDoc(docRef, { status });
};

export { createOrder, updateOrder };
