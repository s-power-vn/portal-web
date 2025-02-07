import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';

import { PickRequestInput, PickRequestInputProps } from './pick-request-input';

export type PickRequestInputFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<PickRequestInputProps, S>;

export const PickRequestInputField = <S extends ObjectSchema<AnyObject>>({
  ...props
}: PickRequestInputFieldProps<S>) => {
  return (
    <FormField {...props}>
      <PickRequestInput {...props.options} />
    </FormField>
  );
};
