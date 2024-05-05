import { Timestamp } from 'firebase/firestore';
import Stripe from 'stripe';

export type User = {
  id: string;
  name: string;
  bio?: string;
  isTrainer: boolean;
  imageUrl?: string;
  point?: number;
  requestPoint?: number;
  kendoExperience?: Experience;
  kendoRank?: Rank;
  biography?: string;
  kendoGoal?: string;
  fcmToken?: string;
  // createdAt: Timestamp;
};

export enum Experience {
  None = '未設定',
  LessThan5 = '5年未満',
  MoreThan5LessThan10 = '5年以上10年未満',
  MoreThan10LessThan20 = '10年以上20年未満',
  MoreThan20LessThan30 = '20年以上30年未満',
  MoreThan30LessThan40 = '30年以上40年未満',
  MoreThan40LessThan50 = '40年以上50年未満',
  MoreThan50 = '50年以上',
}

export enum Rank {
  None = '未設定',
  Kyui = '級位',
  Shodan = '初段',
  Nidan = '二段',
  Sandan = '三段',
  Yondan = '四段',
  Godan = '五段',
  RenshiGodan = '錬士五段',
  Rokudan = '六段',
  RenshiRokudan = '錬士六段',
  Nanadan = '七段',
  KyoshiNanadan = '教士七段',
  Hachidan = '八段',
  HanshiHachidan = '範士八段',
}

export type TrainingRecord = {
  id: string;
  userId: string;
  title: string;
  date?: Date | null;
  withWho?: string;
  memo?: string;
  isPublic: boolean;
  youtubeUrl?: string;
  videoUrl?: string;
  commonKey?: string;
  comments?: Comment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
  watchCount: number;
};

export type ExtendedTrainingRecord = TrainingRecord & {
  isFavorite?: boolean;
};

export type Comment = {
  id: string;
  text: string;
  userId: string;
  isTrainer: boolean;
  focusPoint?: string;
  adviceRequestId?: string;
  createdAt?: Timestamp;
};

export type TrainingRecordFormValues = {
  title: string;
  date?: string | null;
  withWho?: string;
  memo?: string;
  isPublic: 'true' | 'false';
  videoChoice: 'youtubeUrl' | 'videoFile';
  youtubeUrl?: string;
  videoFile?: FileList;
  videoUrl?: string;
  commonKey?: string;
};

export type Notification = {
  id: string;
  message?: string;
  createdAt?: Timestamp;
  type?: NotificationType;
};

export type NotificationType = 'all' | 'individual';

export type ExtendedNotification = Notification & {
  isRead?: boolean;
};

export type ReadNotification = {
  notificationId: string;
  userId: string;
  createAt: Timestamp;
};

export type AdviceRequest = {
  id: string;
  userId: string;
  trainerUserId?: string;
  trainingRecordId?: string;
  status: AdviceStatus;
  limitTime?: Timestamp;
  focusPoint?: string;
  requestPoint?: number;
  paymentPoint?: number;
  paymentStatus?: PaymentStatus;
  createdAt?: Timestamp;
};

export type AdviceStatus =
  | 'pending'
  | 'prepared'
  | 'requested'
  | 'accepted'
  | 'rejected'
  | 'deleted';

export type PaymentStatus = 'pending' | 'finished' | 'unpaid' | 'deleted';

export interface Price {
  id: string;
  currency: string;
  unit_amount: number | null;
}

export interface ProductWithPrices {
  id: string;
  description: string | null;
  name: string;
  images: string[];
  unit_label: string | null | undefined;
  prices: Price[];
}

export type PointHistory = {
  id: string;
  userId: string;
  historyType: historyType;
  point: number;
  item?: Stripe.Response<Stripe.ApiList<Stripe.LineItem>>;
  adviceRequestId?: string;
  createdAt?: Timestamp;
};

export type historyType = 'use' | 'get' | 'add' | 'purchase';

export type Thumbnail = {
  commonKey: string;
  thumbnailUrl: string;
};
