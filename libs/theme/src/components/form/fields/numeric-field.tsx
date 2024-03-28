import { AnyObject, ObjectSchema } from 'yup';

import { InputHTMLAttributes } from 'react';

import { NumericInput } from '../../input';
import { FormField, FormFieldProps } from '../form-field';

export type NumericFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<InputHTMLAttributes<HTMLInputElement>, S>;

export const NumericField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: NumericFieldProps<S>) => {
  return (
    <FormField {...props}>
      <NumericInput {...options} />
    </FormField>
  );
};
