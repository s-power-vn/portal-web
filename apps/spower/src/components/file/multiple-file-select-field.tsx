import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';
import { AnyObject, ObjectSchema } from 'yup';

import {
  MultipleFileSelect,
  MultipleFileSelectProps
} from './multiple-file-select';

export type MultipleFileSelectFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<MultipleFileSelectProps, S>;

export const MultipleFileSelectField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: MultipleFileSelectFieldProps<S>) => {
  return (
    <FormField {...props}>
      <MultipleFileSelect {...options} />
    </FormField>
  );
};
