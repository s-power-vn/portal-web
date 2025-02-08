import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';

import {
  PickRequestDetailInput,
  PickRequestDetailInputProps
} from './pick-request-detail-input';

export type PickRequestDetailInputFieldProps<
  S extends ObjectSchema<AnyObject>
> = FormFieldProps<PickRequestDetailInputProps, S>;

export const PickRequestDetailInputField = <S extends ObjectSchema<AnyObject>>({
  ...props
}: PickRequestDetailInputFieldProps<S>) => {
  return (
    <FormField {...props}>
      <PickRequestDetailInput {...props.options} />
    </FormField>
  );
};
