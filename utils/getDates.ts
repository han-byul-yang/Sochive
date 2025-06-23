import { Timestamp } from "firebase/firestore";

export const getDates = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdayNames = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const weekday = weekdayNames[date.getDay()];

  return { year, month, day, weekday };
};

export const getDateFromTimestamp = (timestamp: Timestamp) => {
  const date = new Date(timestamp?.seconds * 1000);
  return date;
};
