import { AnyObject, ObjectSchema } from 'yup';

import { CheckInput, CheckInputProps } from '../../input/check-input';
import { FormField, FormFieldProps } from '../form-field';

export type CheckFieldProps<S extends ObjectSchema<AnyObject>> = FormFieldProps<
  CheckInputProps,
  S
>;

export const CheckField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: CheckFieldProps<S>) => {
  return (
    <FormField {...props}>
      <CheckInput {...options} />
    </FormField>
  );
};
