export function withTryCatch<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      // ここでエラーハンドリングを一元化
      console.error('An error occurred:', error);
      throw error; // 必要に応じてカスタマイズしたエラーを投げる
    }
  };
}
