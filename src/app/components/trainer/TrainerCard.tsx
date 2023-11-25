import Image from 'next/image';
import { User } from '@/type';
import { imageUrl } from '@/util/logic';

interface TrainerCardProps {
  trainer: User;
  onSelect: (user: User) => void;
}

const TrainerCard = ({ trainer, onSelect }: TrainerCardProps) => {
  return (
    <div
      className="w-full max-w-sm bg-gray-100 border border-gray-200 rounded-lg shadow"
      onClick={() => onSelect(trainer)}
    >
      <div className="flex flex-col items-center p-3">
        <Image
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={imageUrl(trainer.imageUrl)}
          width={64}
          height={64}
          alt={trainer.name}
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900">
          {trainer.name}
        </h5>
        <span className="text-sm text-gray-500">{trainer.kendoRank}</span>
      </div>
    </div>
  );
};

export default TrainerCard;
