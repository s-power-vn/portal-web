import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { SelectEmployeeProps } from './select-employee';
import { SelectEmployee } from './select-employee';

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
