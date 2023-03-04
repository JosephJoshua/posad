import { IconButton } from '@posad/react-core/components/icon-button';
import { Icon, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';

const notify = ({
  icon: IconComponent,
  title,
  message,
}: {
  icon: Icon;
  title: string;
  message: string;
}) => {
  toast.custom(
    (t) => (
      <div
        className={clsx([
          'relative flex items-center justify-between min-w-[256px] gap-4 rounded-md bg-primary-blue px-5 py-3 text-white shadow-2xl transform-gpu',
          'transition-all duration-200',
          t.visible ? 'translate-x-0' : 'translate-x-96',
        ])}
      >
        <div className="flex gap-4 items-center">
          <IconComponent />

          <div className="flex flex-col items-start justify-center cursor-default">
            <div>{title}</div>
            <p>{message}</p>
          </div>
        </div>

        <IconButton
          icon={IconX}
          label="Close"
          className="absolute top-0 right-0"
          size="sm"
          onClick={() => toast.dismiss(t.id)}
        />
      </div>
    ),
    { position: 'bottom-right' }
  );
};

export default notify;
