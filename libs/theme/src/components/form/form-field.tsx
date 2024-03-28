/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject, InferType, ObjectSchema } from 'yup';

import { Children, ReactNode, cloneElement, isValidElement } from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';

import { cn, formatNumber } from '@storeo/core';

import { Label } from '../ui/label';

export type FormFieldProps<T, S extends ObjectSchema<AnyObject>> = {
  schema: S;
  name: Path<InferType<S>>;
  title?: string;
  children?: ReactNode;
  options?: {
    [P in keyof T]: T[P];
  };
};

export const FormField = <T, S extends ObjectSchema<AnyObject>>({
  name,
  title,
  children
}: FormFieldProps<T, S>) => {
  const { control } = useFormContext<InferType<S>>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { invalid, error } }) => {
        const childrenWithProps = Children.map(children, child => {
          if (isValidElement(child)) {
            const { onChange, ref, value, ...fieldProps } = field;
            const handleChange = (v: string) => {
              onChange(v);
              child.props.onChange?.(v);
            };

            const defaultProps: {
              onChange?: (v: string) => void;
              onAccept?: (v: string) => void;
              value: string;
            } = {
              onChange: handleChange,
              value: typeof value === 'number' ? formatNumber(value) : value,
              ...fieldProps
            };

            return cloneElement(
              child,
              typeof value === 'number'
                ? {
                    ...defaultProps,
                    onAccept: handleChange
                  }
                : defaultProps
            );
          }
          return child;
        });

        return (
          <div className={'flex flex-col gap-1'}>
            <Label htmlFor={''}>{title}</Label>
            {childrenWithProps}
            {invalid && (
              <span className={cn(`text-appError text-xs`)}>
                {error?.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};
