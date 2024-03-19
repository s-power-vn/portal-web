import { AnyObject, ObjectSchema } from 'yup';

import { InputHTMLAttributes } from 'react';

import { Input } from '../../ui/input';
import { FormField, FormFieldProps } from '../FormField';

export type TextFieldProps<S extends ObjectSchema<AnyObject>> = FormFieldProps<
  InputHTMLAttributes<HTMLInputElement>,
  S
>;

export const TextField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: TextFieldProps<S>) => {
  return (
    <FormField {...props}>
      <Input {...options} />
    </FormField>
  );
};
