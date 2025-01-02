import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';

import { ImageSelect, ImageSelectProps } from './image-select';

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
