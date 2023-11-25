import { User } from '@/type';
import TrainerCard from './TrainerCard';

interface TrainerCardListProps {
  trainerList: User[];
  onSelect: (trainer: User) => void;
}

const TrainerCardList = ({ trainerList, onSelect }: TrainerCardListProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {trainerList.map(trainer => (
        <TrainerCard key={trainer.id} trainer={trainer} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default TrainerCardList;
