import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ThumbnailService } from '@/service/useCase/thumbnail.service';

const ThumbnailComponent = ({ commonKey }: { commonKey: string }) => {
  const [thumbnailURL, setThumbnailURL] = useState('');

  useEffect(() => {
    const fetchThumbnail = async (commonKey: string) => {
      const data = await ThumbnailService.fetchThumbnail(commonKey);
      if (data) setThumbnailURL(data.thumbnailUrl);
    };
    fetchThumbnail(commonKey);
  }, [commonKey]);

  return thumbnailURL ? (
    <Image
      src={thumbnailURL}
      alt="Thumbnail"
      width={300}
      height={200}
      className="w-full h-auto"
    />
  ) : (
    <p>Loading...</p>
  );
};

export default ThumbnailComponent;
