import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import {
  ObjectMultiselect,
  ObjectMultiselectProps
} from './object-multiselect';

export type ObjectMultiselectFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<ObjectMultiselectProps, S>;

export const ObjectMultiselectField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: ObjectMultiselectFieldProps<S>) => {
  return (
    <FormField {...props}>
      <ObjectMultiselect {...options} />
    </FormField>
  );
};
