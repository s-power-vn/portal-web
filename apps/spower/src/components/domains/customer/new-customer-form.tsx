import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, TextareaField, success } from '@minhdtb/storeo-theme';

const schema = object().shape({
  name: string().required('Hãy nhập tên chủ đầu tư'),
  email: string().email('Sai định dạng email'),
  phone: string(),
  address: string(),
  note: string()
});

export type NewCustomerFormProps = BusinessFormProps;

export const NewCustomerForm: FC<NewCustomerFormProps> = props => {
  const createCustomer = api.customer.create.useMutation({
    onSuccess: async () => {
      success('Thêm chủ đầu tư thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values => createCustomer.mutate(values)}
      onCancel={props.onCancel}
      loading={createCustomer.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'name'}
        title={'Tên chủ đầu tư'}
        options={{}}
      />
      <TextField schema={schema} name={'email'} title={'Email'} options={{}} />
      <TextField
        schema={schema}
        name={'phone'}
        title={'Số điện thoại'}
        options={{}}
      />
      <TextField
        schema={schema}
        name={'address'}
        title={'Địa chỉ'}
        options={{}}
      />
      <TextareaField
        schema={schema}
        name={'note'}
        title={'Ghi chú'}
        options={{}}
      />
    </Form>
  );
};
