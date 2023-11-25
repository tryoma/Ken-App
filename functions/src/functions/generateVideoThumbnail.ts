import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import path from 'path';
import os from 'os';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { extractCommonKey } from '../logic';

export const generateVideoThumbnail = functions
  .region('asia-northeast1')
  .storage.object()
  .onFinalize(async object => {
    const fileBucket = object.bucket;
    const filePath = object.name;
    // filePathがundefinedの場合、処理を中断
    if (!filePath) {
      console.log('File path is undefined.');
      return null;
    }
    const fileName = path.basename(filePath);
    // 既にサムネイルの場合、処理を中断
    if (fileName.startsWith('thumb_')) {
      console.log('Already a Thumbnail.');
      return null;
    }

    const contentType = object.contentType;
    console.log({ contentType });

    // contentTypeが動画でない場合、処理を中断
    if (!contentType?.startsWith('video/')) {
      console.log('This is not a video.');
      return null;
    }
    const commmonKey = extractCommonKey(filePath ?? '');

    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const tempThumbPath = path.join(os.tmpdir(), `thumb_${fileName}.png`);
    const thumbFilePath = path.join(
      'videos/thumbnails',
      `thumb_${fileName}.png`
    );

    await bucket.file(filePath).download({ destination: tempFilePath });

    return new Promise((resolve, reject) => {
      if (!ffmpegStatic) {
        throw new Error('ffmpeg-static path is null');
      }
      ffmpeg(tempFilePath)
        .setFfmpegPath(ffmpegStatic)
        .screenshots({
          timestamps: ['00:00:02'],
          filename: `thumb_${fileName}.png`,
          folder: os.tmpdir(),
          size: '300x200',
        })
        .on('end', async () => {
          console.log('Thumbnail created');
          await bucket.upload(tempThumbPath, {
            destination: thumbFilePath,
          });

          // サムネイルのダウンロードURLを取得
          const thumbFileRef = bucket.file(thumbFilePath);
          const thumbURL = await thumbFileRef.getSignedUrl({
            action: 'read',
            expires: Date.now() + 100 * 365 * 24 * 60 * 60 * 1000, // 有効期限の設定
          });

          // Firestoreに動画のURLとサムネイルのURLを保存
          await admin.firestore().collection('Thumbnails').add({
            thumbnailUrl: thumbURL[0],
            commonKey: commmonKey,
          });

          fs.unlinkSync(tempFilePath);
          fs.unlinkSync(tempThumbPath);
          resolve(console.log('Thumbnail URL saved to Firestore!!'));
        })
        .on('error', err => {
          console.error('Error creating thumbnail:', err);
          reject(err);
        });
    });
  });
