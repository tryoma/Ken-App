import { FaBookOpenReader } from 'react-icons/fa6';
import HoverWrapper from './hover/hoverWrapper';

export const OpenReadIcon = () => {
  return (
    <HoverWrapper text="読みました">
      <FaBookOpenReader />
    </HoverWrapper>
  );
};

export const OpenReadIconRead = () => {
  return (
    <HoverWrapper text="既読">
      <FaBookOpenReader color={'gray'} />
    </HoverWrapper>
  );
};
