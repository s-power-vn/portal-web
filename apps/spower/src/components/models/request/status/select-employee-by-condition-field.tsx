import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@storeo/theme';

import {
  SelectEmployeeByCondition,
  SelectEmployeeByConditionProps
} from './select-employee-by-condition';

export type SelectEmployeeByConditionFieldProps<
  S extends ObjectSchema<AnyObject>
> = FormFieldProps<SelectEmployeeByConditionProps, S>;

export const SelectEmployeeByConditionField = <
  S extends ObjectSchema<AnyObject>
>({
  options,
  ...props
}: SelectEmployeeByConditionFieldProps<S>) => {
  return (
    <FormField {...props}>
      <SelectEmployeeByCondition {...options} />
    </FormField>
  );
};
