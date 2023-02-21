import { IconClock } from '@tabler/icons-react';
import { FC } from 'react';

const ProductCard: FC = () => {
  return (
    <div className="flex flex-col gap-3 font-medium">
      <div className="w-[312px] h-[192px] bg-gray-100 rounded-2xl"></div>
      <div className="flex justify-between px-1">
        <span>Carrots</span>
        <div className="flex items-center gap-2">
          <IconClock />
          <span>2d</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
