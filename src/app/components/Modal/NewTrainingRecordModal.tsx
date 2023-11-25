import { TrainingRecordFormValues } from '@/type';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { storage } from '../../../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { formatDate, getDateString } from '@/util/logic';
import { yupResolver } from '@hookform/resolvers/yup';
import { TrainingRecordSchema } from '@/validationSchema';

interface Props {
  onNewRecordModalClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  userId: string;
}

const NewTrainingRecordModal = ({
  onNewRecordModalClose,
  onSubmit,
  userId,
}: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TrainingRecordFormValues>({
    mode: 'all',
    defaultValues: {
      title: '',
      isPublic: 'false',
      date: getDateString(),
      videoChoice: 'youtubeUrl',
      youtubeUrl: '',
    },
    resolver: yupResolver(TrainingRecordSchema),
  });

  const [uploading, setUploading] = useState(false);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const enhancedSubmit = async (data: TrainingRecordFormValues) => {
    const files = data.videoFile;
    const date = formatDate(new Date());

    if (files && files[0]) {
      const file = files[0];
      try {
        setUploading(true);
        const commonKey = `${userId}-${date}`;
        const fileRef = ref(storage, `videos/${commonKey}_${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        data.videoUrl = downloadURL;
        data.commonKey = commonKey;
        setUploading(false);
        onNewRecordModalClose();
      } catch (error) {
        console.error('Error uploading file: ', error);
        setUploading(false);
        return;
      }
    }

    await onSubmit(data);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileSizeInBytes = file.size;
      const fileSizeInKilobytes = fileSizeInBytes / 1024;
      setFileSize(fileSizeInKilobytes.toFixed(2) + ' KB');
    }
  };

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onNewRecordModalClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-white p-5 border shadow-lg rounded-md w-full md:w-3/5 max-h-full overflow-y-auto max-w-screen-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-xl leading-6 font-bold text-gray-900 mb-3">
            新しい稽古記録の作成
          </h3>
        </div>
        <form onSubmit={handleSubmit(enhancedSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              タイトル
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.title && (
              <span className="text-red-500 text-xs italic">
                {errors.title.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              稽古日
              <span className="ml-1 text-xs border border-gray-500 p-1 rounded">
                任意
              </span>
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.date && (
              <span className="text-red-500 text-xs italic">
                {errors.date.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="withWho"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              稽古相手
              <span className="ml-1 text-xs border border-gray-500 p-1 rounded">
                任意
              </span>
            </label>
            <input
              id="withWho"
              type="text"
              {...register('withWho')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.withWho && (
              <span className="text-red-500 text-xs italic">
                {errors.withWho.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="videoChoice"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              動画選択
            </label>
            <select
              id="videoChoice"
              {...register('videoChoice')}
              onChange={e => {
                setValue(
                  'videoChoice',
                  e.target.value as 'youtubeUrl' | 'videoFile'
                );
                setValue('youtubeUrl', '');
                setValue('videoFile', undefined);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="youtubeUrl">YouTube URL</option>
              <option value="videoFile">動画ファイル</option>
            </select>
          </div>
          {watch('videoChoice') === 'youtubeUrl' ? (
            <div className="mb-4">
              <label
                htmlFor="youtubeUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Youtube URL
              </label>
              <input
                id="youtubeUrl"
                type="text"
                {...register('youtubeUrl')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.youtubeUrl && (
                <span className="text-red-500 text-xs italic">
                  {errors.youtubeUrl.message}
                </span>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <label
                htmlFor="videoFile"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                動画ファイル
              </label>
              <input
                id="videoFile"
                type="file"
                {...register('videoFile')}
                onChange={handleFileChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                accept="video/*"
              />
              {fileSize && <p>ファイルサイズ: {fileSize}</p>}
              {errors.videoFile && (
                <span className="text-red-500 text-xs italic">
                  {errors.videoFile.message}
                </span>
              )}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="isPublic"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              公開設定
            </label>
            <select
              id="isPublic"
              {...register('isPublic')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="true">公開</option>
              <option value="false">非公開</option>
            </select>
            {watch('isPublic') === 'true' ? (
              <span className="text-red-400 text-sm">
                ※公開すると、ほかのユーザーも動画を確認できるようになります。
              </span>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              htmlFor="memo"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              メモ
              <span className="ml-1 text-xs border border-gray-500 p-1 rounded">
                任意
              </span>
            </label>
            <textarea
              id="memo"
              rows={3}
              {...register('memo')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.memo && (
              <span className="text-red-500 text-xs italic">
                {errors.memo.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            新規作成
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTrainingRecordModal;
