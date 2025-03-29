import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { SelectFinishedRequestProps } from './select-finished-request';
import { SelectFinishedRequest } from './select-finished-request';

export type SelectFinishedRequestFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<SelectFinishedRequestProps, S>;

export const SelectFinishedRequestField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: SelectFinishedRequestFieldProps<S>) => {
  return (
    <FormField {...props}>
      <SelectFinishedRequest {...options} />
    </FormField>
  );
};
