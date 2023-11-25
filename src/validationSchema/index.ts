import { Experience, Rank, User } from '@/type';
import * as yup from 'yup';

// const MAX_FILE_SIZE = 102400;

export const TrainingRecordSchema = yup.object().shape({
  title: yup
    .string()
    .label('タイトル')
    .required('タイトルは必須です')
    .max(50, 'タイトルは50文字以内で入力してください'),
  youtubeUrl: yup
    .string()
    .label('Youtube動画URL')
    .when('videoChoice', {
      is: 'youtubeUrl',
      then: schema =>
        schema
          .matches(
            /(?!=\")\b(?:https?):\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w!?/+\-|:=~;.,*&@#$%()'"[\]]+/g,
            '正しいYoutube動画URLを入力してください'
          )
          .required('Youtube動画URLを入力してください'),
    }),
  videoFile: yup
    .mixed<FileList>()
    .label('動画ファイル')
    .test('fileSize', 'ファイルサイズは100MB以下にしてください', value => {
      if (!value || value.length == 0) return true;
      return value[0].size <= 1024000000;
    })
    .when('videoChoice', {
      is: 'videoFile',
      then: schema => schema.required('動画ファイルを選択してください'),
    }),
  videoChoice: yup
    .string()
    .oneOf(['youtubeUrl', 'videoFile'], 'どちらかを選択してください')
    .required('どちらかを選択してください'),
  date: yup
    .string()
    .nullable()
    .transform((value, originalValue) =>
      // 入力された値が空文字だったらnullを返す
      originalValue === '' ? null : originalValue
    )
    .test('is-before-or-today', '今日以前の日付を入力してください', value => {
      // valueがnullの場合は検証をパスさせる
      if (!value) return true;

      // valueが今日の日付かそれ以前かを検証
      return value <= new Date().toISOString().slice(0, 10);
    }),
  withWho: yup
    .string()
    .label('稽古相手')
    .max(30, '30文字以内で入力してください'),
  memo: yup.string().label('メモ').max(1000, '1000文字以内で入力してください'),
  isPublic: yup
    .string()
    .oneOf(['true', 'false'], 'どちらかを選択してください')
    .required('どちらかを選択してください'),
});

export const UserSchema: yup.ObjectSchema<User> = yup.object().shape({
  id: yup.string().label('ID').required('IDは必須です'),
  name: yup
    .string()
    .label('名前')
    .required('名前は必須です')
    .max(30, '30文字以内で入力してください'),
  bio: yup.string().label('自己紹介').max(100, '100文字以内で入力してください'),
  biography: yup
    .string()
    .label('略歴')
    .max(100, '100文字以内で入力してください'),
  isTrainer: yup
    .boolean()
    .label('トレーナー')
    .required('トレーナーかどうかを選択してください'),
  imageUrl: yup.string().label('画像URL'),
  point: yup.number().label('ポイント'),
  requestPoint: yup.number().label('リクエストポイント'),
  kendoExperience: yup
    .mixed<Experience>()
    .oneOf(Object.values(Experience))
    .label('剣道経験年数'),
  kendoRank: yup.mixed<Rank>().oneOf(Object.values(Rank)).label('剣道経験年数'),
  kendoGoal: yup
    .string()
    .label('剣道の目標')
    .max(100, '100文字以内で入力してください'),
});

export const RequestFormSchema = yup.object().shape({
  focusPoint: yup
    .string()
    .label('注目してほしいポイント')
    .max(300, '300文字以内で入力してください')
    .required('注目してほしいポイントは必須です'),
});

export const ResponceFormSchema = yup.object().shape({
  responceComment: yup
    .string()
    .label('アドバイスコメント')
    .max(300, '300文字以内で入力してください')
    .min(50, '50文字以上で入力してください')
    .required('アドバイスコメントは必須です'),
});
