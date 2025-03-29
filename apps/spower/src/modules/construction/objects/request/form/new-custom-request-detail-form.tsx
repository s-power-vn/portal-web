import type { InferType } from 'yup';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, TextareaField } from '@minhdtb/storeo-theme';

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
      onSuccess={props.onSubmit}
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
