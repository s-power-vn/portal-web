import type { AnyObject, ObjectSchema } from 'yup';

import { FormField, type FormFieldProps } from '@minhdtb/storeo-theme';

import { ProcessDropdown, type ProcessDropdownProps } from './process-dropdown';

export type ProcessDropdownFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<ProcessDropdownProps, S>;

export const ProcessDropdownField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: ProcessDropdownFieldProps<S>) => {
  return (
    <FormField {...props}>
      <ProcessDropdown {...options} />
    </FormField>
  );
};
