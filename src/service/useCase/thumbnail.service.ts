import { ThumbnailRepository } from '../repository';

export const ThumbnailService = {
  fetchThumbnail: async (commonKey: string) => {
    return ThumbnailRepository.fetchThumbnail(commonKey);
  },
};
