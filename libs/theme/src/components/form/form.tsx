import { yupResolver } from '@hookform/resolvers/yup';
import { AnyObject, InferType, ObjectSchema } from 'yup';

import { FormHTMLAttributes } from 'react';
import {
  DefaultValues,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';

export type FormProps<S extends ObjectSchema<AnyObject>> = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  loading?: boolean;
  defaultValues?: DefaultValues<InferType<S>>;
  onSubmit?: (formData: InferType<S>) => void;
  schema: S;
};

export const Form = <S extends ObjectSchema<AnyObject>>({
  loading,
  schema,
  defaultValues,
  children,
  onSubmit,
  ...props
}: FormProps<S>) => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  console.log(methods.formState.errors);

  const onSubmitData: SubmitHandler<InferType<S>> = v => {
    onSubmit?.(v);
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmitData)} {...props}>
      <FormProvider {...methods}>{children}</FormProvider>
    </form>
  );
};
