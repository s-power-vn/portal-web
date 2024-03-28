import { AnyObject, ObjectSchema } from 'yup';

import { TextareaHTMLAttributes } from 'react';

import { Textarea } from '../../ui/textarea';
import { FormField, FormFieldProps } from '../form-field';

export type TextareaFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<TextareaHTMLAttributes<HTMLTextAreaElement>, S>;

export const TextareaField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: TextareaFieldProps<S>) => {
  return (
    <FormField {...props}>
      <Textarea {...options} />
    </FormField>
  );
};
