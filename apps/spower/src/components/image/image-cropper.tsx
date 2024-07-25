import { v4 } from 'uuid';

import { FC, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Crop, ReactCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Button } from '@storeo/theme';

function getCroppedImage(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string,
  type: string
): Promise<File | undefined> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx?.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => {
        if (!blob) {
          return resolve(undefined);
        }
        const file = new File([blob], fileName, {
          lastModified: new Date().getMilliseconds(),
          type: type
        });

        resolve(file);
      }, type);
    } catch (e) {
      reject(e);
    }
  });
}

export type ImageCropperProps = {
  source: string;
  aspect?: number;
  onCancel: () => void;
  onSuccess?: (file: File) => void;
};

export const ImageCropper: FC<ImageCropperProps> = props => {
  const [image, setImage] = useState<HTMLImageElement>();
  const [imageSrc, setImageSrc] = useState<string>(props.source);
  const [output, setOutput] = useState<File>();

  const [crop, setCrop] = useState<Crop>();

  useEffect(() => {
    setImageSrc(props.source);
  }, [props.source]);

  const onLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      const { naturalWidth, naturalHeight } = e.currentTarget;
      setImage(e.currentTarget);

      const currentCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 100
          },
          props.aspect ?? 1,
          naturalWidth,
          naturalHeight
        ),
        naturalWidth,
        naturalHeight
      );

      setCrop(currentCrop);
    },
    [props.aspect]
  );

  const onSubmit = useCallback(() => {
    if (output) {
      props.onSuccess?.(output);
    }
  }, [output, props]);

  return (
    <div className={'flex flex-col'}>
      <ReactCrop
        crop={crop}
        onChange={c => setCrop(c)}
        aspect={props.aspect}
        onComplete={async cropped => {
          if (image) {
            const file = await getCroppedImage(
              image,
              cropped,
              `${v4()}.jpeg`,
              'image/jpeg'
            );
            setOutput(file);
          }
        }}
      >
        <img
          alt={'crop'}
          src={imageSrc}
          onLoad={onLoad}
          crossOrigin={'anonymous'}
        />
      </ReactCrop>
      <div className={'mt-6 flex justify-end gap-2'}>
        <Button type="reset" onClick={props.onCancel} variant="secondary">
          Bỏ qua
        </Button>
        <Button type="submit" onClick={onSubmit}>
          Chấp nhận
        </Button>
      </div>
    </div>
  );
};
