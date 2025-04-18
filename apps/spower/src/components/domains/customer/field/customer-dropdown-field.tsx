import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { CustomerDropdownProps } from './customer-dropdown';
import { CustomerDropdown } from './customer-dropdown';

export type CustomerDropdownFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<CustomerDropdownProps, S>;

export const CustomerDropdownField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: CustomerDropdownFieldProps<S>) => {
  return (
    <FormField {...props}>
      <CustomerDropdown {...options} />
    </FormField>
  );
};
