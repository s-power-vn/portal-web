import { customerApi } from 'portal-api';
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

export type EditCustomerFormProps = BusinessFormProps & {
  customerId: string;
};

export const EditCustomerForm: FC<EditCustomerFormProps> = props => {
  const customerById = customerApi.byId.useSuspenseQuery({
    variables: props.customerId
  });

  const updateCustomer = customerApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa chủ đầu tư thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values =>
        updateCustomer.mutate({
          id: props.customerId,
          ...values
        })
      }
      onCancel={props.onCancel}
      defaultValues={customerById.data}
      loading={updateCustomer.isPending}
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
