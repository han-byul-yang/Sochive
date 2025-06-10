import { db } from "@/lib/firebase";
import { DrawingData, Photo, PhotoData } from "@/types";
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

export const createPhotoStore = async (
  userId: string,
  photoData: PhotoData
) => {
  const photoRef = collection(db, "Users", userId, "Photos");
  await addDoc(photoRef, photoData);
};

export const getPhotos = async (
  userId: string,
  month: number,
  year: number
) => {
  const photoRef = collection(db, "Users", userId, "Photos");
  const q = query(
    photoRef,
    where("month", "==", month),
    where("year", "==", year)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updatePhotoStore = async (
  userId: string,
  photoData: Partial<PhotoData>,
  photoId: string
) => {
  const photoRef = doc(db, "Users", userId, "Photos", photoId);
  await updateDoc(photoRef, photoData);
};

export const createDrawingStore = async (
  userId: string,
  drawingData: DrawingData
) => {
  const drawingRef = collection(db, "Users", userId, "Drawings");
  await addDoc(drawingRef, drawingData);
};

export const updateDrawingStore = async (
  userId: string,
  drawingData: DrawingData,
  drawingId: string
) => {
  const drawingRef = doc(db, "Users", userId, "Drawings", drawingId);
  await updateDoc(drawingRef, drawingData);
};

export const getDrawingStore = async (userId: string, month: number, year: number) => {
  const drawingRef = collection(db, "Users", userId, "Drawings");
  const q = query(
    drawingRef,
    where("month", "==", month),
    where("year", "==", year)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};