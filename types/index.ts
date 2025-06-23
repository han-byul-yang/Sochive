import { PenTipStyle } from "@/components/Modals/DrawingModal";
import { SkPath } from "@shopify/react-native-skia";
import { FieldValue, Timestamp } from "firebase/firestore";
import { Point } from "react-native-gesture-handler/lib/typescript/web/interfaces";

export interface Photo {
  name: string;
  id: number;
  createdAt: Date;
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

export type DrawingData = {
  month: number;
  year: number;
  drawing: {
    currentPath: Point[];
    color: string;
    opacity: number;
    strokeWidth: number;
    penTipStyle: PenTipStyle;
    selectedTool: string;
    isEraser: boolean;
  }[];
};

export type DrawingDocData = {
  id: string;
  month: number;
  year: number;
  drawing: {
    currentPath: Point[];
    color: string;
    opacity: number;
    strokeWidth: number;
    penTipStyle: PenTipStyle;
    selectedTool: string;
    isEraser: boolean;
  }[];
};

export type MemoData = {
  photoId: string;
  date: string;
  memo: string;
  category: string;
  location: string;
  hashtags: string[];
  rating: number;
  title: string;
};

export type MemoDocData = {
  id: string;
  photoId: string;
  date: string;
  memo: string;
  category: string;
  hashtags: string[];
  location: string;
  rating: number;
  title: string;
};
