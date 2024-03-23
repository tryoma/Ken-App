import { ExtendedTrainingRecord, TrainingRecordFormValues } from '@/type';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TrainingRecordSchema } from '@/validationSchema';
import { getDateString } from '@/util/logic';
import DefaultModal from './DefaultModal';

interface Props {
  trainingRecord: ExtendedTrainingRecord;
  onEditRecordClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const EditTrainingRecordModal = ({
  trainingRecord,
  onEditRecordClose,
  onSubmit,
}: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TrainingRecordFormValues>({
    mode: 'all',
    defaultValues: {
      title: trainingRecord.title,
      date: getDateString(trainingRecord.date || undefined),
      withWho: trainingRecord.withWho,
      memo: trainingRecord.memo,
      isPublic: trainingRecord.isPublic ? 'true' : 'false',
      videoChoice: trainingRecord.youtubeUrl ? 'youtubeUrl' : 'videoFile',
      youtubeUrl: trainingRecord.youtubeUrl || '',
      videoUrl: trainingRecord.videoUrl || '',
    },
    resolver: yupResolver(TrainingRecordSchema),
  });

  return (
    <DefaultModal onCloseModal={onEditRecordClose}>
      <>
        <div className="flex justify-between items-center">
          <h3 className="text-xl leading-6 font-bold text-gray-900 mb-3">
            新しい稽古記録の作成
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            編集
          </button>
        </form>
      </>
    </DefaultModal>
  );
};

export default EditTrainingRecordModal;
