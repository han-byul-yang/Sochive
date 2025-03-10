import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where,
  writeBatch,
  getCountFromServer,
} from "firebase/firestore";

// 사용자 생성 및 초기 폴더 설정
export const createUserStore = async (userId: string, email: string) => {
  console.log("createUserStore", userId, email);
  try {
    const userRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email,
        createdAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
};
