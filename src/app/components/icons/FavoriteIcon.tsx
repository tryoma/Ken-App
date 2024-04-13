import { FaHeart, FaRegHeart } from 'react-icons/fa';
import HoverWrapper from './hover/hoverWrapper';

export const FavoriteOffIcon = () => {
  return (
    <HoverWrapper text="お気に入り登録">
      <FaRegHeart color={'gray'} />
    </HoverWrapper>
  );
};

export const FavoriteOnIcon = () => {
  return (
    <HoverWrapper text="お気に入り解除">
      <FaHeart color={'red'} />
    </HoverWrapper>
  );
};
