import { object, string } from 'yup';

import { FC } from 'react';

import { Button, Form, TextField, success } from '@storeo/theme';

import { customerApi } from '../../../api';

const schema = object().shape({
  name: string().required('Hãy nhập tên chủ đầu tư'),
  email: string().email('Sai định dạng email'),
  phone: string(),
  address: string(),
  note: string()
});

export type EditCustomerFormProps = {
  customerId: string;
  onSuccess: () => void;
};

export const EditCustomerForm: FC<EditCustomerFormProps> = props => {
  const customerById = customerApi.byId.useSuspenseQuery({
    variables: props.customerId
  });

  const updateCustomer = customerApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa chủ đầu tư thành công');
      props.onSuccess();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values =>
        updateCustomer.mutate({
          id: props.customerId,
          ...values
        })
      }
      defaultValues={customerById.data}
      loading={updateCustomer.isPending}
      className={'mt-4 flex flex-col gap-3'}
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
      <TextField schema={schema} name={'note'} title={'Ghi chú'} options={{}} />
      <div className={'mt-6 flex justify-end'}>
        <Button type="submit">Chấp nhận</Button>
      </div>
    </Form>
  );
};
