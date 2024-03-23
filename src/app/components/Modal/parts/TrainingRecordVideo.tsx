import { ExtendedTrainingRecord } from '@/type';
import { extractYoutubeVideoId, formatTimeAgo } from '@/util/logic';

interface Props {
  trainingRecord: ExtendedTrainingRecord | null | undefined;
}

const TrainingRecordVideo = ({ trainingRecord }: Props) => {
  if (!trainingRecord) {
    return null;
  }

  const { title, withWho, memo, createdAt, watchCount } = trainingRecord;

  return (
    <>
      {trainingRecord.videoUrl ? (
        // selectedRecordにvideoUrlがあれば、その動画を表示
        <video className="w-full h-52" controls>
          <source src={trainingRecord.videoUrl} type="video/mp4" />
        </video>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${extractYoutubeVideoId(
            trainingRecord.youtubeUrl || ''
          )}`}
          title="YouTube video player"
          className="w-full h-80"
          allowFullScreen
        ></iframe>
      )}
      <div className="items-center my-2">
        <h3 className="text-xl leading-6 font-bold text-gray-900">{title}</h3>
        <div className="rounded bg-gray-200 p-2 mt-1 text-sm text-gray-500">
          <p className="font-bold">
            {watchCount.toLocaleString()}回視聴{' '}
            {createdAt && formatTimeAgo(createdAt)}
          </p>
          {withWho && <p>{withWho}との稽古</p>}
          <p>{memo}</p>
        </div>
      </div>
    </>
  );
};

export default TrainingRecordVideo;
