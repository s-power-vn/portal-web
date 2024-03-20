import { AnyObject, ObjectSchema } from 'yup';

import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { FormField, FormFieldProps } from '../FormField';

export type SelectData = {
  label: string;
  value: string;
};

export type SelectFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<
    {
      value?: string;
      onChange?: (value: string) => void;
      items?: SelectData[];
    },
    S
  >;

export const SelectField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: SelectFieldProps<S>) => {
  return (
    <FormField {...props}>
      <Select
        value={options?.value}
        onValueChange={value => {
          options?.onChange?.(value);
        }}
      >
        <SelectTrigger className={'h-8'}>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Hiển thị</SelectLabel>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="40">40</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormField>
  );
};
