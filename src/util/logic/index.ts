import { Timestamp } from 'firebase/firestore';

export function extractYoutubeVideoId(url: string) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return null;
  }
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export const imageUrl = (url: string | undefined): string => {
  return url ? url : '/sample-profile.png';
};

export const formatDateMMddHHmm = (
  inputDate: Date | Timestamp | null | undefined
) => {
  if (!inputDate) return '';
  let date = new Date();
  if (inputDate instanceof Date) {
    date = inputDate;
  } else if (inputDate instanceof Timestamp) {
    date = inputDate.toDate();
  }

  // 月と日を取得
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // フォーマットされた日時文字列を返す
  const formattedDate = `${month}月${day}日`;

  return formattedDate;
};

export const getDateString = (target: Date = new Date()) => {
  const year = target.getFullYear();
  const month = (target.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため、1を加算
  const day = target.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatTimeAgo = (timestamp: { toDate: () => Date }): string => {
  const date = timestamp.toDate(); // Timestamp を Date に変換
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}分前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}週間前`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}か月前`;

  const years = Math.floor(days / 365);
  return `${years}年前`;
};
