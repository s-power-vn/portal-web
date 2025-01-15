import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';

import { RoleDropdown, RoleDropdownProps } from './role-dropdown';

export type RoleDropdownFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<RoleDropdownProps, S>;

export const RoleDropdownField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: RoleDropdownFieldProps<S>) => {
  return (
    <FormField {...props}>
      <RoleDropdown {...options} />
    </FormField>
  );
};
