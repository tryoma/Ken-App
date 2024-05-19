'use client';

import { CommonService } from '@/service/useCase/common.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContentMap, ContentType } from '@/type';
import { createValue, getTitle } from '../contents';

type Props = {
  contentID: string;
};

const ContentPage = ({ params: { contentID } }: { params: Props }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentType = searchParams.get('contentType') as ContentType;
  const [content, setContent] = useState<ContentMap[ContentType] | null>(null);
  const [editData, setEditData] = useState<Partial<ContentMap[ContentType]>>(
    {}
  );

  useEffect(() => {
    if (!contentType) return;
    const fetchContent = async () => {
      const content = await CommonService.fetchContentById(
        contentType,
        contentID
      );
      setContent(content);
    };
    fetchContent();
  }, [contentType, contentID]);

  useEffect(() => {
    if (content) {
      setEditData(content);
    }
  }, [content]);

  const updateData = async () => {
    if (!contentType) return;
    await CommonService.updateContentById(contentType, contentID, editData);
  };

  if (!content) return <div>loading...</div>;

  return (
    <div className="m-5 p-5 bg-white shadow rounded-lg">
      <div className="w-4/5 m-auto">
        <h1 className="text-2xl font-bold mb-5">{getTitle(contentType)}</h1>
        <div className="mt-3 space-y-4 w-full">
          {Object.entries(editData).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-grow">
                <label className="w-1/4 font-medium">{key}</label>
                <input
                  className="border-2 border-gray-200 rounded-md p-2 focus:outline-none focus:border-blue-500 transition-colors w-full"
                  value={createValue(value)}
                  onChange={e =>
                    setEditData(prev => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            </div>
          ))}
          <div className="flex justify-evenly">
            <button
              onClick={updateData}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              更新
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

export default ContentPage;
