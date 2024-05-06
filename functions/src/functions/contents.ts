import { Content } from '../type';

export const contents: Content[] = [
  {
    announceType: 'createAdviceRequestToTrainer',
    fcmTitle: '【Ken-App】からのお知らせ',
    fcmBody: 'アドバイス依頼が届いています',
    fcmClickAction:
      'https://dev.ken-app.com/private/general/dashboard/advice-requests-for-me',
    emailSubject: '【Ken-App】からのお知らせ',
    emailBody:
      '【依頼者の名前】からのアドバイス依頼が届いています。アドバイス依頼を確認しましょう。',
  },
  {
    announceType: 'responceAdviceRequestToUser',
    fcmTitle: '【Ken-App】からのお知らせ',
    fcmBody: 'アドバイス依頼が回答されました',
    fcmClickAction:
      'https://dev.ken-app.com/private/general/dashboard/advice-requests',
    emailSubject: '【Ken-App】からのお知らせ',
    emailBody:
      '【トレーナーの名前】からアドバイス依頼が回答されました。回答を確認しましょう。',
  },
  {
    announceType: 'adviceRequestCanceledToUser',
    fcmTitle: '【Ken-App】からのお知らせ',
    fcmBody: '【トレーナーの名前】へのアドバイス依頼がキャンセルされました',
    fcmClickAction:
      'https://dev.ken-app.com/private/general/dashboard/advice-requests',
    emailSubject: '【Ken-App】からのお知らせ',
    emailBody:
      '期限内にアドバイス依頼が回答されなかったため、【トレーナーの名前】へのアドバイス依頼がキャンセルされました。使用したポイントの【ポイント】Pは返却されています。',
  },
  {
    announceType: 'adviceRequestCanceledToTrainer',
    fcmTitle: '【Ken-App】からのお知らせ',
    fcmBody: '【依頼者の名前】からのアドバイス依頼がキャンセルされました',
    fcmClickAction:
      'https://dev.ken-app.com/private/general/dashboard/advice-requests',
    emailSubject: '【Ken-App】からのお知らせ',
    emailBody:
      '期限内にアドバイス依頼が回答されなかったため、【依頼者の名前】からのアドバイス依頼がキャンセルされました。',
  },
];
