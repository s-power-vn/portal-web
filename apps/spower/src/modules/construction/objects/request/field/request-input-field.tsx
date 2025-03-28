import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { RequestInputProps } from './request-input';
import { RequestInput } from './request-input';

export type RequestInputFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<Omit<RequestInputProps, 'schema'>, S>;

export const RequestInputField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: RequestInputFieldProps<S>) => {
  return (
    <FormField {...props}>
      <RequestInput schema={props.schema} {...options} />
    </FormField>
  );
};
