import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { ImageSelectProps } from './image-select';
import { ImageSelect } from './image-select';

export type ImageSelectFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<ImageSelectProps, S>;

export const ImageSelectField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: ImageSelectFieldProps<S>) => {
  return (
    <FormField {...props}>
      <ImageSelect {...options} />
    </FormField>
  );
};
