import { Show } from '@minhdtb/storeo-core';
import { closeModal, showModal } from '@minhdtb/storeo-theme';
import { ImageIcon } from 'lucide-react';

import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { ImageCropper } from './image-cropper';

export type ImageSelectProps = {
  value?: string;
  onChange?: (value?: File) => void;
  width?: number;
  height?: number;
};

export const ImageSelect: FC<ImageSelectProps> = props => {
  const [image, setImage] = useState<string | undefined>(props.value);
  const { width = 150, height = 150 } = props;
  const modalId = useRef<string | undefined>();

  useEffect(() => {
    setImage(props.value);
  }, [props.value]);

  const onSuccessHandler = useCallback(
    async (file: File) => {
      props.onChange?.(file);

      const reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target?.result as string);
      };

      reader.readAsDataURL(file);

      if (modalId.current) {
        closeModal(modalId.current);
      }
    },
    [props]
  );

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.item(0);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          modalId.current = showModal({
            title: 'Cắt ảnh',
            children: (
              <ImageCropper
                source={reader.result as string}
                aspect={1}
                onSuccess={onSuccessHandler}
                onCancel={onCancelHandler}
              />
            )
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [onCancelHandler, onSuccessHandler]);

  return (
    <button
      className={'flex items-center justify-center rounded-lg border p-1'}
      style={{
        width,
        height
      }}
      onClick={handleSelectImage}
      type={'reset'}
    >
      <Show when={image} fallback={<ImageIcon className={'h-10 w-10'} />}>
        <img src={image} width={width} height={height} alt="avatar" />
      </Show>
    </button>
  );
};
