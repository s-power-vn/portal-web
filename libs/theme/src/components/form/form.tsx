import { yupResolver } from '@hookform/resolvers/yup';
import { AnyObject, InferType, ObjectSchema } from 'yup';

import { FormHTMLAttributes } from 'react';
import {
  DefaultValues,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';

import { Button } from '../ui/button';

export type BusinessFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export type FormProps<S extends ObjectSchema<AnyObject>> = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  loading?: boolean;
  defaultValues?: DefaultValues<InferType<S>>;
  onSubmit?: (formData: InferType<S>) => void;
  onCancel?: () => void;
  schema: S;
};

export const Form = <S extends ObjectSchema<AnyObject>>({
  loading,
  schema,
  defaultValues,
  children,
  onSubmit,
  onCancel,
  ...props
}: FormProps<S>) => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmitData: SubmitHandler<InferType<S>> = v => {
    onSubmit?.(v);
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmitData)} {...props}>
      <FormProvider {...methods}>{children}</FormProvider>
      <div className={'mt-6 flex justify-end gap-2'}>
        <Button type="reset" onClick={onCancel} variant="secondary">
          Bỏ qua
        </Button>
        <Button disabled={!methods.formState.isDirty} type="submit">
          Chấp nhận
        </Button>
      </div>
    </form>
  );
};
