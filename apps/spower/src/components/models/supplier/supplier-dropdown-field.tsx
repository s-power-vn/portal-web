import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';
import { AnyObject, ObjectSchema } from 'yup';

import { SupplierDropdown, SupplierDropdownProps } from './supplier-dropdown';

export type SupplierDropdownFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<SupplierDropdownProps, S>;

export const SupplierDropdownField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: SupplierDropdownFieldProps<S>) => {
  return (
    <FormField {...props}>
      <SupplierDropdown {...options} />
    </FormField>
  );
};
