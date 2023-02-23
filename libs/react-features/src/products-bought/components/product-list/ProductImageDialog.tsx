import { Button } from '@posad/react-core/components/button';
import {
  SimpleDialog,
  SimpleDialogProps,
} from '@posad/react-core/components/simple-dialog';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import clsx from 'clsx';
import {
  getProductImageUrl,
  ProductImageFormValue,
  uploadProductImage,
} from '@posad/business-logic/features/products-bought';
import { ChangeEvent, FC, useEffect, useState } from 'react';

export type ProductImageProps = Pick<
  SimpleDialogProps,
  'isOpen' | 'onClose'
> & {
  value: ProductImageFormValue;
  onChange: (value: ProductImageFormValue) => void;
  inputName?: string;
};

const maxImageSizeMb = 5;

const ProductImageDialog: FC<ProductImageProps> = ({
  isOpen,
  onClose,
  inputName,
  value,
  onChange,
}) => {
  const { firebaseUser } = useAuthContext();

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (value == null || !isOpen) return;
    getProductImageUrl(value.path).then((url) => setPreview(url));
  }, [value, isOpen]);

  useEffect(() => {
    if (selectedFile == null) {
      setPreview(undefined);
      return;
    }

    const url = URL.createObjectURL(selectedFile);

    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files == null || files.length === 0) return;

    const file = files[0];
    if (file.size > maxImageSizeMb * 1024 * 1024) {
      setErrorMessage('Please select a file that is less than 5 MB');
      return;
    }

    setSelectedFile(files[0]);
  };

  const handleUpload = async () => {
    if (firebaseUser == null) return;

    if (selectedFile == null) {
      onClose?.();
      return;
    }

    setLoading(true);

    uploadProductImage(firebaseUser.uid, selectedFile)
      .then(({ path, url }) =>
        onChange({
          path,
          url,
          originalFileName: selectedFile.name,
          source: 'user',
        })
      )
      .catch((error) => {
        if (error instanceof Error) setErrorMessage(error.message);
      })
      .finally(() => {
        reset();
        onClose?.();
        setLoading(false);
      });
  };

  const closeErrorDialog = () => setErrorMessage(null);

  const reset = () => {
    setSelectedFile(undefined);
    setPreview(undefined);
    setErrorMessage(null);
    setLoading(false);
  };

  return (
    <SimpleDialog
      title="Product image"
      actions={
        <div className="flex justify-end mt-3">
          <Button
            variant="filled"
            size="sm"
            className="!px-6"
            onClick={() => handleUpload()}
            isLoading={isLoading}
          >
            OK
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <label
        className={clsx(
          'mt-3 cursor-pointer flex flex-col rounded-lg border-4 border-dashed w-full h-60 group text-center select-none',
          preview == null ? 'p-10' : 'p-4'
        )}
      >
        <div className="h-full w-full text-center flex flex-col items-center justify-center">
          {preview == null ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={clsx(
                  'w-10 h-10 text-gray-500',
                  'transition duration-200',
                  'group-hover:text-primary-blue'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <p className="text-gray-500 mt-3">
                <span>Drag and drop files here</span>
                <br />
                <span>or select a file from your computer</span>
              </p>
            </>
          ) : (
            <img
              src={preview}
              alt=""
              className="h-full w-auto object-contain rounded-md"
            />
          )}
        </div>

        <input
          type="file"
          className="hidden"
          accept="image/*"
          name={inputName}
          onChange={handleFileChange}
        />
      </label>

      <SimpleDialog
        title="File upload"
        children={errorMessage}
        isOpen={errorMessage != null}
        onClose={closeErrorDialog}
        actions={
          <div className="flex justify-end mt-3">
            <Button
              variant="filled"
              size="sm"
              className="!px-6"
              onClick={() => closeErrorDialog()}
            >
              OK
            </Button>
          </div>
        }
      />
    </SimpleDialog>
  );
};

export default ProductImageDialog;
