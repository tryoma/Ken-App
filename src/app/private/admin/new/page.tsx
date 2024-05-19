'use client';

import { CommonService } from '@/service/useCase/common.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ContentMap, ContentType } from '@/type';
import { getTitle, initialDataMap } from '../contents';
import { useToastContext } from '@/context/ToastContext';

const NewContentPage = () => {
  const router = useRouter();
  const showToast = useToastContext();
  const searchParams = useSearchParams();
  const contentType = searchParams.get('contentType') as ContentType;

  const initialData = contentType ? initialDataMap[contentType] : {};
  const [newData, setNewData] =
    useState<Partial<ContentMap[ContentType]>>(initialData);

  const createData = async () => {
    if (!contentType) return;
    try {
      await CommonService.createContent(contentType, newData);
      router.push('/private/admin');
    } catch (error) {
      console.error(error);
      showToast('作成に失敗しました。', 'error');
    }
  };

  return (
    <div className="m-5 p-5 bg-white shadow rounded-lg">
      <div className="w-4/5 m-auto">
        <h1 className="text-2xl font-bold mb-5">{getTitle(contentType)}</h1>
        <div className="mt-3 space-y-4 w-full">
          {Object.entries(newData).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-grow">
                <label className="w-1/4 font-medium">{key}</label>
                <input
                  className="border-2 border-gray-200 rounded-md p-2 focus:outline-none focus:border-blue-500 transition-colors w-full"
                  value={value || ''}
                  onChange={e =>
                    setNewData(prev => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            </div>
          ))}
          <div className="flex justify-evenly">
            <button
              onClick={createData}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              作成
            </button>
            <button
              onClick={() => router.push('/private/admin')}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContentPage;
