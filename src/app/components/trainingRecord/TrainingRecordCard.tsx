import Image from 'next/image';
import { useEffect, useState } from 'react';
import { extractYoutubeVideoId, formatTimeAgo, imageUrl } from '@/util/logic';
import { ExtendedTrainingRecord, TrainingRecord, User } from '@/type';
import ThumbnailComponent from './Thumbnail/Thumbnail';
import { UserService } from '@/service/useCase/user.service';

interface TrainingRecordCardProps {
  trainingRecord: ExtendedTrainingRecord;
  onSelect: (trainingRecord: TrainingRecord) => void;
}

const TrainingRecordCard = ({
  trainingRecord,
  onSelect,
}: TrainingRecordCardProps) => {
  const [trainingRecordUser, setTrainingRecordUser] = useState<User | null>(
    null
  );
  const { youtubeUrl, videoUrl, title, createdAt, watchCount } = trainingRecord;

  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserService.fetchUser(trainingRecord.userId);
      setTrainingRecordUser(user);
    };
    fetchUser();
  }, [trainingRecord]);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer"
      onClick={() => onSelect(trainingRecord)}
    >
      <div className="">
        {youtubeUrl && (
          <Image
            src={`https://img.youtube.com/vi/${extractYoutubeVideoId(
              youtubeUrl
            )}/0.jpg`}
            width={300}
            height={200}
            alt={trainingRecord.title}
            className="w-full h-auto"
          />
        )}
        {videoUrl && (
          <ThumbnailComponent commonKey={trainingRecord.commonKey ?? ''} />
        )}
      </div>
      <div className="flex m-1">
        <div className="w-1/6">
          <Image
            src={imageUrl(trainingRecordUser?.imageUrl)}
            width={100}
            height={100}
            alt="アイコン"
            className="rounded-full border-solid border border-gray-400 bg-white"
          />
        </div>
        <div className="ml-1 w-5/6 ">
          <p className="text-sm font-bold text-gray-700">{title}</p>
          <div className="mt-0.5">
            <p className="text-xs text-gray-500">{trainingRecordUser?.name}</p>
            <div className="flex">
              {createdAt && (
                <p className="text-xs text-gray-500">{formatTimeAgo(createdAt)}</p>
              )}
              <p className="text-xs text-gray-500 pl-1">{watchCount.toLocaleString()}回視聴</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingRecordCard;
