import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { MultipleFileSelectProps } from './multiple-file-select';
import { MultipleFileSelect } from './multiple-file-select';

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
