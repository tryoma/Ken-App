import { Timestamp } from 'firebase-admin/firestore';

export type Content = {
  announceType: AnnounceType;
  fcmTitle: string;
  fcmBody: string;
  fcmClickAction: string;
  emailSubject: string;
  emailBody: string;
};

export type AnnounceType =
  | 'createAdviceRequestToTrainer'
  | 'responceAdviceRequestToUser'
  | 'adviceRequestCanceledToUser'
  | 'adviceRequestCanceledToTrainer';

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
