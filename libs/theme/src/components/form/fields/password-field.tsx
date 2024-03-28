import { AnyObject, ObjectSchema } from 'yup';

import { InputHTMLAttributes } from 'react';

import { Input } from '../../ui/input';
import { FormField, FormFieldProps } from '../form-field';

export type PasswordFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>, S>;

export const PasswordField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: PasswordFieldProps<S>) => {
  return (
    <FormField {...props}>
      <Input {...options} type="password" autoComplete={'new-password'} />
    </FormField>
  );
};
