import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@storeo/theme';

import { CustomerDropdown, CustomerDropdownProps } from './CustomerDropdown';

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
