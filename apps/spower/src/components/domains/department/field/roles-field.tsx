import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { RolesProps } from './roles';
import { Roles } from './roles';

export type RolesFieldProps<S extends ObjectSchema<AnyObject>> = FormFieldProps<
  RolesProps,
  S
>;

export const RolesField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: RolesFieldProps<S>) => {
  return (
    <FormField {...props}>
      <Roles {...options} />
    </FormField>
  );
};
