import { Button } from '@posad/react-core/components/button';
import { IconButton } from '@posad/react-core/components/icon-button';
import { Input } from '@posad/react-core/components/input';
import { IconCamera } from '@tabler/icons-react';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Datepicker from 'react-tailwindcss-datepicker';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import {
  addProduct,
  addProductFormSchema,
  AddProductFormValues,
} from '@posad/business-logic/features/products-bought';
import ProductImageDialog from './ProductImageDialog';

export type AddProductFormProps = {
  onClose?: () => void;
};

const AddProductForm: FC<AddProductFormProps> = ({ onClose }) => {
  const { firebaseUser } = useAuthContext();

  const containerRef = useRef<HTMLFormElement>(null);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    control,
    formState: { isValid },
  } = useForm<AddProductFormValues>({
    resolver: yupResolver(addProductFormSchema),
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

  const handleFormSubmit = async (values: AddProductFormValues) => {
    if (firebaseUser == null) return;

    setLoading(true);

    /**
     * TODO: change
     */
    const sectionId = 'default';

    return addProduct(firebaseUser.uid, {
      sectionId,
      name: values.name,
      imageUrl: values.image.path,
      imageSource: values.image.source,
      expirationDate: Timestamp.fromDate(values.expirationDate),
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
      <div className="px-3">
        <Input
          {...register('name')}
          placeholder="Product name"
          className="pl-1"
          autoFocus
        />

        <div className="flex gap-2 mt-2 max-w-full">
          <Controller
            control={control}
            name="image"
            render={({ field: { onChange, value, name } }) => (
              <>
                <IconButton
                  className="!pl-4 !pr-3 !py-1.5 !gap-12 text-ellipsis text-sm"
                  variant="outlined"
                  icon={
                    value?.url == null ? (
                      <IconCamera size={20} />
                    ) : (
                      <img
                        className="w-[20px] h-[20px] rounded-full object-cover"
                        src={value.url}
                        alt=""
                      />
                    )
                  }
                  iconPosition="right"
                  label={
                    value?.originalFileName == null
                      ? 'Product image'
                      : value.originalFileName
                  }
                  onClick={() => setImageDialogOpen(true)}
                  showLabel
                />

                <ProductImageDialog
                  isOpen={imageDialogOpen}
                  onClose={() => setImageDialogOpen(false)}
                  value={value}
                  onChange={onChange}
                  inputName={name}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="expirationDate"
            render={({ field: { onChange, value, name } }) => (
              <Datepicker
                asSingle
                primaryColor="indigo"
                containerClassName="!w-auto group"
                inputClassName={clsx(
                  'h-full cursor-pointer !py-1.5',
                  'placeholder:text-slate-500 placeholder:font-normal enabled:hover:placeholder:text-primary-blue',
                  'group-hover:bg-gray-100'
                )}
                toggleClassName={'text-primary-blue'}
                placeholder="Expiration date"
                value={{
                  startDate: value,
                  endDate: value,
                }}
                onChange={(val) => onChange(val?.startDate)}
                inputName={name}
              />
            )}
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
