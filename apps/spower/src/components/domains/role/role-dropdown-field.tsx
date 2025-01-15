import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { RoleDropdownProps } from './role-dropdown';
import { RoleDropdown } from './role-dropdown';

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
