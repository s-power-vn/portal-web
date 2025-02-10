import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { SupplierDropdownProps } from './supplier-dropdown';
import { SupplierDropdown } from './supplier-dropdown';

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
