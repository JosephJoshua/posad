import { Button } from '@posad/react-core/components/button';
import { Input } from '@posad/react-core/components/input';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import {
  addSection,
  editSection,
  sectionEntryFormSchema,
  SectionEntryFormValues,
} from '@posad/business-logic/features/products-bought';
import { useForm } from 'react-hook-form';

type BaseFormProps = {
  onClose?: () => void;
  className?: string;
};

type AddSectionFormProps = {
  action: 'add';
  sectionBeforeId: string;
  initialValues?: undefined;
  sectionId?: undefined;
};

type EditSectionFormProps = {
  action: 'edit';
  initialValues: SectionEntryFormValues;
  sectionId: string;
  sectionBeforeId?: undefined;
};

export type ProductEntryFormProps = BaseFormProps &
  (AddSectionFormProps | EditSectionFormProps);

const SectionEntryForm: FC<ProductEntryFormProps> = ({
  onClose,
  initialValues,
  sectionId,
  sectionBeforeId,
  action,
  className,
}) => {
  const { firebaseUser } = useAuthContext();

  const containerRef = useRef<HTMLFormElement>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { isValid },
  } = useForm<SectionEntryFormValues>({
    resolver: yupResolver(sectionEntryFormSchema),
    mode: 'onChange',
    defaultValues: initialValues,
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

  const handleFormSubmit = async (values: SectionEntryFormValues) => {
    if (firebaseUser == null) return;
    setLoading(true);

    const promise =
      action === 'add'
        ? addSection(firebaseUser.uid, sectionBeforeId, values)
        : editSection(firebaseUser.uid, { ...values, id: sectionId });

    return promise
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
        'focus-within:border-gray-500',
        className
      )}
      ref={containerRef}
      onKeyUp={handleKeyDown}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="px-3">
        <Input
          {...register('name')}
          placeholder="Section name"
          className="pl-1"
          autoFocus
        />
      </div>

      <div className="h-px w-full bg-gray-200 mt-2"></div>

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
          {action === 'add' ? 'Add section' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default SectionEntryForm;
