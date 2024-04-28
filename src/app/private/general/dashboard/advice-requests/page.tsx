'use client';
import { useEffect, useState } from 'react';
import { AdviceRequest } from '@/type';
import { useAppContext } from '@/context/AppContext';
import AdviceRequestDetailModal from '@/app/components/Modal/AdviceRequestDetailModal';
import UserCard from '@/app/components/UserCard';
import { AdviceRequestService } from '@/service/useCase/advice-request.service';
import { AdviceStatus } from '../../../../../type/index';
import AdviceArea from '@/app/components/adviceArea/AdviceArea';

const AdviceRequests = () => {
  const { userId } = useAppContext();
  const [selectContentStatus, setSelectContentStatus] =
    useState<AdviceStatus>('prepared');
  const [selectedAdviceRequest, setSelectedAdviceRequest] =
    useState<AdviceRequest | null>(null);

  const handleRequestClick = (adviceRequest: AdviceRequest) => {
    setSelectedAdviceRequest(adviceRequest);
    document.body.style.overflow = 'hidden';
  };

  const onModalClose = () => {
    setSelectedAdviceRequest(null);
    document.body.style.overflow = '';
  };

  const contents: { title: string; status: AdviceStatus }[] = [
    {
      title: '依頼作成中',
      status: 'prepared',
    },
    {
      title: '依頼中',
      status: 'requested',
    },
    {
      title: '回答済み',
      status: 'accepted',
    },
    {
      title: 'キャンセル',
      status: 'rejected',
    },
  ];

  const handleSelectChange = (status: AdviceStatus) => {
    setSelectContentStatus(status);
  };

  const isSelectContent = (status: AdviceStatus) => {
    return status === selectContentStatus;
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">アドバイス依頼一覧</h1>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select your country
        </label>
        <select
          id="tabs"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          onChange={e => handleSelectChange(e.target.value as AdviceStatus)}
          value={selectContentStatus}
        >
          {contents.map(content => {
            return (
              <option key={content.title} value={content.status}>
                {content.title}
              </option>
            );
          })}
        </select>
      </div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        {contents.map(content => {
          return (
            <li
              key={content.title}
              className="w-full cursor-pointer"
              onClick={() => handleSelectChange(content.status)}
            >
              <a
                className={`inline-block w-full p-2 border-r ${
                  isSelectContent(content.status)
                    ? 'bg-gray-300 text-gray-900'
                    : ''
                }`}
              >
                {content.title}
              </a>
            </li>
          );
        })}
      </ul>

      <AdviceArea
        userId={userId}
        contentStatus={selectContentStatus}
        clickRequest={handleRequestClick}
      />
      {selectedAdviceRequest && (
        <AdviceRequestDetailModal
          onModalClose={onModalClose}
          selectedAdviceRequest={selectedAdviceRequest}
        />
      )}
    </div>
  );
};

export default AdviceRequests;
