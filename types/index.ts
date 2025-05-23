import { FieldValue, Timestamp } from "firebase/firestore";
import { Point } from "react-native-gesture-handler/lib/typescript/web/interfaces";

export interface Photo {
  uri: string;
  originalUri?: string;
  width: number;
  height: number;
  touchPoints?: Point[];
  position: {
    x: number;
    y: number;
  };
  zIndex: number;
  rotation: number;
  scale: number;
  filter?: string;
  memo?: string;
  cropPath?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

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
