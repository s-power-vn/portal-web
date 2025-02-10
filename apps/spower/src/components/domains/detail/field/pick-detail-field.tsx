import { AnyObject, ObjectSchema } from 'yup';

import { FC } from 'react';

import { FormField, FormFieldProps } from '@minhdtb/storeo-theme';

import { PickDetail, PickDetailProps } from './pick-detail';

export type PickDetailFieldProps = FormFieldProps<
  PickDetailProps,
  ObjectSchema<AnyObject>
>;

export const PickDetailField: FC<PickDetailFieldProps> = ({
  options,
  ...props
}) => {
  return (
    <FormField {...props}>
      <PickDetail {...options} />
    </FormField>
  );
};
