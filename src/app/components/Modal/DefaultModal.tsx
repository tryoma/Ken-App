import { MouseEvent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onCloseModal: () => void;
}

const DefaultModal = ({ children, onCloseModal }: Props) => {
  const onModalClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCloseModal();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-[1000]"
      onClick={onModalClose}
    >
      <div className="relative bg-white p-5 border shadow-lg rounded-md w-full md:w-3/5 max-h-full overflow-y-auto max-w-screen-sm">
        {children}
      </div>
    </div>
  );
};

export default DefaultModal;
