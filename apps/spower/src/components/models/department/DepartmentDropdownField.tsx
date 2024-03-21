import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@storeo/theme';

import {
  DepartmentDropdown,
  DepartmentDropdownProps
} from './DepartmentDropdown';

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
