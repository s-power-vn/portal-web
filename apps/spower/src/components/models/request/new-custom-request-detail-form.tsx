import { InferType, object, string } from 'yup';

import React, { FC } from 'react';

import {
  BusinessFormProps,
  Form,
  TextField,
  TextareaField
} from '@storeo/theme';

const schema = object().shape({
  title: string().required('Hãy nhập mô tả công việc'),
  unit: string().required('Hãy nhập đơn vị')
});

export type NewCustomRequestDetailFormProps = BusinessFormProps & {
  onSubmit: (values: InferType<typeof schema>) => void;
};

export const NewCustomRequestDetailForm: FC<
  NewCustomRequestDetailFormProps
> = props => {
  return (
    <Form
      schema={schema}
      onSubmit={props.onSubmit}
      onCancel={props.onCancel}
      className={'flex flex-col gap-3'}
      defaultValues={{
        title: '',
        unit: ''
      }}
    >
      <TextareaField schema={schema} name={'title'} title={'Mô tả công việc'} />
      <TextField schema={schema} name={'unit'} title={'Đơn vị'} />
    </Form>
  );
};
