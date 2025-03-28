import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { PriceInputProps } from './price-input';
import { PriceInput } from './price-input';

export type PriceInputFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<Omit<PriceInputProps, 'schema'>, S>;

export const PriceInputField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: PriceInputFieldProps<S>) => {
  return (
    <FormField {...props}>
      <PriceInput schema={props.schema} {...options} />
    </FormField>
  );
};
