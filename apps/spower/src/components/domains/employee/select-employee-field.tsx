import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';

import { SelectEmployee, SelectEmployeeProps } from './select-employee';

export type SelectEmployeeFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<SelectEmployeeProps, S>;

export const SelectEmployeeField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: SelectEmployeeFieldProps<S>) => {
  return (
    <FormField {...props}>
      <SelectEmployee {...options} />
    </FormField>
  );
};
