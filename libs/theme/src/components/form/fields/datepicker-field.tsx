import { AnyObject, ObjectSchema } from 'yup';

import { DatePicker, DatePickerProps } from '../../datepicker';
import { FormField, FormFieldProps } from '../form-field';

export type DatePickerFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<DatePickerProps, S>;

export const DatePickerField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: DatePickerFieldProps<S>) => {
  return (
    <FormField {...props}>
      <DatePicker {...options} />
    </FormField>
  );
};
