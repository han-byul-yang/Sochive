import { FieldValue, Timestamp } from "firebase/firestore";

export type Photo = {
  originalUri: string;
  uri: string;
  position: {
    x: number;
    y: number;
  };
  zIndex: number;
  rotation: number;
  scale: number;
  filter?: string;
  memo?: string;
  width?: number;
  height?: number;
};

export type PhotoData = {
  photos: Photo[];
  month: number;
  year: number;
  background: string | null;
  createdAt: FieldValue;
};

export type PhotoDocData = {
  id: string;
  photos: Photo[];
  month: number;
  year: number;
  background: string | null;
  createdAt: Timestamp;
};
