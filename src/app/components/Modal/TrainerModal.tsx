import Image from 'next/image';
import { User } from '@/type';
import { imageUrl } from '@/util/logic';
import DefaultModal from './DefaultModal';

interface Props {
  trainer: User | null;
  onModalClose: () => void;
  onRequest: (trainer: User) => void;
}

const TrainerModal = ({ trainer, onModalClose, onRequest }: Props) => {
  if (!trainer) {
    return null;
  }

  const handleRequest = async () => {
    const isConfirmed = window.confirm('本当に依頼しますか？');

    // ユーザーが確認ボタンをクリックした場合
    if (isConfirmed) {
      await onRequest(trainer);
      onModalClose(); // モーダルを閉じる
    }
  };

  return (
    <DefaultModal onCloseModal={onModalClose}>
      <div className="text-center">
        <div className="flex flex-col items-center p-3">
          <Image
            src={imageUrl(trainer.imageUrl)}
            width={64}
            height={64}
            alt={trainer.name}
            className="w-44 h-44 rounded-full"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900">
            {trainer.name}
          </h5>
          <span className="text-sm text-gray-500">{trainer.kendoRank} </span>
        </div>
        <p className="text-gray-700">{trainer.bio}</p>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleRequest}
        >
          依頼する
        </button>
      </div>
    </DefaultModal>
  );
};

export default TrainerModal;
