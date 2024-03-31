import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(), // タイムスタンプを追加
    winston.format.colorize(), // ログの重要度に応じて色を付ける（コンソール出力のみ）
    winston.format.simple(), // シンプルなフォーマット（主にコンソール用）
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    ) // カスタムフォーマット
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: 'logger/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logger/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    })
  );
}

export default logger;
