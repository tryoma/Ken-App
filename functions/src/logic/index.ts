export const extractCommonKey = (url: string) => {
  const regex = /\/([^_]+)_/;
  const match = url.match(regex);

  if (match && match.length > 1) {
    return match[1];
  } else {
    return null; // マッチする部分が見つからなかった場合はnullを返すなど適切なエラー処理を行う
  }
};
