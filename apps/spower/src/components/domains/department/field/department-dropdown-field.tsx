import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { DepartmentDropdownProps } from './department-dropdown';
import { DepartmentDropdown } from './department-dropdown';

export type DepartmentDropdownFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<DepartmentDropdownProps, S>;

export const DepartmentDropdownField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: DepartmentDropdownFieldProps<S>) => {
  return (
    <FormField {...props}>
      <DepartmentDropdown {...options} />
    </FormField>
  );
};
