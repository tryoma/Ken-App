import { ContentMap, ContentType } from '@/type';
import { CommonRepository } from '../repository/common.repository';

export const CommonService = {
  fetchContentsSubscribe: (
    contentType: ContentType,
    onContents: (contents: ContentMap[ContentType][]) => void
  ) => {
    return CommonRepository.fetchContentsSubscribe(contentType, onContents);
  },

  fetchContentById: async (contentType: ContentType, id: string) => {
    return CommonRepository.fetchContentById(contentType, id);
  },

  updateContentById: async (
    contentType: ContentType,
    id: string,
    data: Partial<ContentMap[ContentType]>
  ) => {
    return CommonRepository.updateContentById(contentType, id, data);
  },

  createContent: async (
    contentType: ContentType,
    data: Partial<ContentMap[ContentType]>
  ) => {
    return CommonRepository.createContent(contentType, data);
  },
};
