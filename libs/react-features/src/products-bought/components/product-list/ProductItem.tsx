import { IconButton } from '@posad/react-core/components/icon-button';
import { IconClock, IconEdit, IconTrash } from '@tabler/icons-react';
import { FC } from 'react';

const ProductItem: FC = () => {
  return (
    <li className="flex justify-between items-center border-b border-b-gray-200 pr-2 pb-3 gap-4 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-[48px] h-[48px] bg-slate-100 rounded-full"></div>

        <div className="flex flex-col">
          <div className="text-lg">Carrots</div>
          <div className="flex items-center gap-2">
            <IconClock size={18} className="text-slate-600" />
            <span className="text-slate-600">2d</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <IconButton icon={IconEdit} label="Edit" />
        <IconButton icon={IconTrash} label="Delete" />
      </div>
    </li>
  );
};

export default ProductItem;
