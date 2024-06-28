/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject, InferType, ObjectSchema, SchemaDescription } from 'yup';

import {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useId
} from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';

import { Show, cn, formatNumber } from '@storeo/core';

import { Label } from '../ui/label';

export type FormFieldProps<T, S extends ObjectSchema<AnyObject>> = {
  schema: S;
  name: Path<InferType<S>>;
  title?: string;
  children?: ReactNode;
  className?: string;
  options?: {
    [P in keyof T]: T[P];
  };
};

export const FormField = <T, S extends ObjectSchema<AnyObject>>({
  schema,
  name,
  title,
  children,
  className
}: FormFieldProps<T, S>) => {
  const id = useId();
  const { control } = useFormContext<InferType<S>>();

  const isRequiredField = useCallback(
    (name: string) => {
      return !!(
        schema.describe().fields[name] as SchemaDescription
      )?.tests.find(test => test.name === 'required');
    },
    [schema]
  );

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
              id: string;
              onChange?: (v: string) => void;
              onAccept?: (v: string) => void;
              value: string;
            } = {
              id,
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
          <div className={cn('flex flex-col gap-1', className)}>
            <Show when={title}>
              <Label htmlFor={id}>
                {title}
                <Show when={isRequiredField(name)}>
                  <span className={'text-appError'}>*</span>
                </Show>
              </Label>
            </Show>
            {childrenWithProps}
            <Show when={invalid}>
              <span className={cn(`text-appError text-xs`)}>
                {error?.message}
              </span>
            </Show>
          </div>
        );
      }}
    />
  );
};
