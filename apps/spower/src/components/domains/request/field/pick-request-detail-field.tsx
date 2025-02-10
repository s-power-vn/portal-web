import { AnyObject, ObjectSchema } from 'yup';

import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';

import {
  PickRequestDetail,
  PickRequestDetailProps
} from './pick-request-detail';

export type PickRequestDetailFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<PickRequestDetailProps, S>;

export const PickRequestDetailField = <S extends ObjectSchema<AnyObject>>({
  ...props
}: PickRequestDetailFieldProps<S>) => {
  return (
    <FormField {...props}>
      <PickRequestDetail {...props.options} />
    </FormField>
  );
};
