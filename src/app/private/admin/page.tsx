'use client';

import { useRouter } from 'next/navigation';
import { adminPageContents, createValue, getKeys } from './contents';
import { useEffect, useState } from 'react';
import { CommonService } from '@/service/useCase/common.service';
import { ContentMap, ContentType } from '@/type';

const Admin = () => {
  const router = useRouter();
  const [selectedContent, setSelectedContent] =
    useState<ContentType>('Notifications');
  const [contents, setContents] = useState<ContentMap[ContentType][] | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = CommonService.fetchContentsSubscribe(
      selectedContent,
      contents => {
        setContents(contents);
      }
    );

    return () => unsubscribe();
  }, [selectedContent]);

  const handleClickDetail = (id: string) => {
    const contentType = selectedContent;
    if (!contentType || !id) return;
    router.push(`/private/admin/${id}?contentType=${contentType}`);
  };

  const handleClickNew = () => {
    const contentType = selectedContent;
    if (!contentType) return;
    router.push(`/private/admin/new?contentType=${contentType}`);
  };

  return (
    <div className="mt-8">
      <div className="flex space-x-4 px-4">
        {adminPageContents.map(content => (
          <button
            key={content.key}
            onClick={() => setSelectedContent(content.key)}
            className={
              'px-4 py-2 rounded' +
              (selectedContent === content.key
                ? ' bg-custom-gray text-custom-white'
                : ' text-custom-gray')
            }
          >
            {content.title}
          </button>
        ))}
      </div>
      {contents && (
        <div className="relative overflow-x-auto p-2">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {getKeys(selectedContent)?.map(key => (
                  <th scope="col" className="px-6 py-3" key={key}>
                    {key}
                  </th>
                ))}
                <th scope="col" className="px-6 py-3">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {contents.map(content => (
                <tr
                  key={content.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  {getKeys(selectedContent)?.map(key => (
                    <td className="px-6 py-4" key={key}>
                      {createValue(
                        content[key as keyof ContentMap[ContentType]]
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <button
                      className="bg-custom-white text-custom-black rounded p-1"
                      onClick={() => handleClickDetail(content.id)}
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-center">
        <button
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleClickNew}
        >
          新規作成
        </button>
      </div>
    </div>
  );
};

export default Admin;
