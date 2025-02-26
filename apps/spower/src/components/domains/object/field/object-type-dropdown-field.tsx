import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import type { ObjectTypeDropdownProps } from './object-type-dropdown';
import { ObjectTypeDropdown } from './object-type-dropdown';

export type ObjectTypeDropdownFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<ObjectTypeDropdownProps, S>;

export const ObjectTypeDropdownField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: ObjectTypeDropdownFieldProps<S>) => {
  return (
    <FormField {...props}>
      <ObjectTypeDropdown {...options} />
    </FormField>
  );
};
