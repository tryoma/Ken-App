import { MdDeleteForever } from 'react-icons/md';
import HoverWrapper from './hover/hoverWrapper';

const DeleteIcon = () => {
  return (
    <HoverWrapper text="削除">
      <MdDeleteForever />
    </HoverWrapper>
  );
};

export default DeleteIcon;
