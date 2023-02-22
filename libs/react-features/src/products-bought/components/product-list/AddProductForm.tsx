import { Button } from '@posad/react-core/components/button';
import { IconButton } from '@posad/react-core/components/icon-button';
import { Input } from '@posad/react-core/components/input';
import { IconCalendar, IconCamera } from '@tabler/icons-react';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { addDoc, Timestamp } from 'firebase/firestore';
import { collections, useAuthContext } from '@posad/react-core/libs/firebase';

export type AddProductFormProps = {
  onClose?: () => void;
};

const formSchema = yup.object({
  name: yup.string().required(),
  /**
   * TODO: change to required
   */
  expirationDate: yup.date(),
});

type FormValues = yup.InferType<typeof formSchema>;

const AddProductForm: FC<AddProductFormProps> = ({ onClose }) => {
  const { firebaseUser } = useAuthContext();

  const containerRef = useRef<HTMLFormElement>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key.toLowerCase() === 'escape') {
      event.preventDefault();
      event.stopPropagation();

      onClose?.();
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    if (firebaseUser == null) return;

    setLoading(true);

    return addDoc(collections.expiringProducts(firebaseUser.uid, 'default'), {
      name: values.name,
      imageUrl: 'test',
      expirationDate: Timestamp.fromDate(new Date()),
    })
      .then(() => {
        reset();
        onClose?.();
      })
      .finally(() => setLoading(false));
  };

  return (
    <form
      className={clsx(
        'rounded-md border border-gray-200 pt-1 pb-2',
        'transition duration-200',
        'focus-within:border-gray-500'
      )}
      ref={containerRef}
      onKeyUp={handleKeyDown}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="px-2">
        <Input
          {...register('name')}
          placeholder="Product name"
          className="pl-1"
          autoFocus
        />

        <div className="flex gap-2">
          <IconButton
            className="!p-2 !gap-2 mt-2 text-sm"
            variant="outlined"
            icon={<IconCalendar size={20} />}
            label="Expiration date"
            showLabel
          />

          <IconButton
            className="!p-2 !gap-2 mt-2 text-sm"
            variant="outlined"
            icon={<IconCamera size={20} />}
            label="Product image"
            showLabel
          />
        </div>
      </div>

      <div className="h-px w-full bg-gray-200 mt-4"></div>

      <div className="flex justify-end mx-2 mt-2 gap-2">
        <Button
          variant="filled-ghost"
          className="text-sm"
          onClick={() => onClose?.()}
        >
          Cancel
        </Button>

        <Button
          variant="filled"
          type="submit"
          size="sm"
          className="h-[44px]"
          isLoading={isLoading}
          disabled={!isValid}
        >
          Add product
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
