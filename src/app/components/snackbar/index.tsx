'use client';

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

export type SnackbarHandler = {
  open: (message: string, duration?: number) => void;
};

export const CommonSnackbarWithRef = forwardRef<SnackbarHandler>((_, ref) => {
  const [message, setMessage] = useState('');
  const [isOpened, setOpened] = useState(false);

  const handleClose = useCallback(() => setOpened(false), []);

  useImperativeHandle(ref, () => ({
    open: (message, duration = 3000) => {
      setMessage(message);
      setOpened(true);
      setTimeout(() => {
        setOpened(false);
      }, duration);
    },
  }));

  return (
    isOpened && (
      <div className="fixed bottom-0 right-0 p-6">
        <div className={`bg-green-500 text-white py-2 px-4 rounded`}>
          <div className="flex justify-between items-center">
            <span>{message}</span>
            {/* <button onClick={() => handleClose}>閉じる</button> */}
          </div>
        </div>
      </div>
    )
  );
});

CommonSnackbarWithRef.displayName = 'CommonSnackbarWithRef';
