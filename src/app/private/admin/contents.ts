import { ContentType, Notification, User } from '@/type';
import { formatDateMMddHHmm } from '@/util/logic';
import { Timestamp } from 'firebase/firestore';

type Content = {
  key: ContentType;
  title: string;
};

export const adminPageContents: Content[] = [
  {
    key: 'Notifications',
    title: 'お知らせ',
  },
  {
    key: 'Users',
    title: 'ユーザー',
  },
];

type UserKeys = keyof User;
export const userKeys: UserKeys[] = [
  'id',
  'name',
  'isTrainer',
  'isAdmin',
  'point',
  'requestPoint',
];

type NotificationKeys = keyof Notification;
export const notificationKeys: NotificationKeys[] = [
  'id',
  'message',
  'createdAt',
  'type',
  'userId',
];

export const initialDataMap = {
  Notifications: {
    message: '',
    type: '',
    userId: '',
  },
  Users: { message: '', type: '', userId: '' },
};

export const getKeys = (content: ContentType) => {
  switch (content) {
    case 'Notifications':
      return notificationKeys;
    case 'Users':
      return userKeys;
    default:
      return null;
  }
};

export const createValue = (
  value: string | boolean | Timestamp | undefined | null
) => {
  if (value instanceof Timestamp) {
    return formatDateMMddHHmm(value);
  }
  if (typeof value === 'boolean') {
    return value ? '◯' : '×';
  }
  if (!value) return '-';
  return value;
};

export const getTitle = (content: ContentType) => {
  switch (content) {
    case 'Notifications':
      return 'お知らせ';
    case 'Users':
      return 'ユーザー';
    default:
      return '';
  }
};
