import Image from 'next/image';
import { MouseEvent } from 'react';
import { User } from '@/type';
import { imageUrl } from '@/util/logic';

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

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onModalClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-[10000]"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-white p-5 border shadow-lg rounded-md w-full md:w-2/5 max-h-full overflow-y-auto max-w-screen-sm text-center">
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
    </div>
  );
};

export default TrainerModal;
