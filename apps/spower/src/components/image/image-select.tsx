import { ImageIcon } from 'lucide-react';

import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { Show } from '@minhdtb/storeo-core';
import { showModal } from '@minhdtb/storeo-theme';

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

  useEffect(() => {
    setImage(props.value);
  }, [props.value]);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.item(0);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          showModal({
            title: 'Cắt ảnh',
            children: ({ close }) => (
              <ImageCropper
                source={reader.result as string}
                aspect={1}
                onSuccess={(file: File) => {
                  props.onChange?.(file);

                  const reader = new FileReader();

                  reader.onload = function (e) {
                    setImage(e.target?.result as string);
                  };

                  reader.readAsDataURL(file);

                  close();
                }}
                onCancel={close}
              />
            )
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [props]);

  return (
    <button
      className={'flex items-center justify-center rounded-lg border p-1'}
      style={{
        width,
        height
      }}
      onClick={handleSelectImage}
      type={'button'}
    >
      <Show when={image} fallback={<ImageIcon className={'h-10 w-10'} />}>
        <img src={image} width={width} height={height} alt="avatar" />
      </Show>
    </button>
  );
};
