import { object, string } from 'yup';

import { FC } from 'react';

import { Button, Form, TextField, success } from '@storeo/theme';

import { supplierApi } from '../../../api';

const schema = object().shape({
  name: string().required('Hãy nhập tên nhà cung cấp'),
  email: string().email('Sai định dạng email'),
  phone: string(),
  address: string(),
  note: string()
});

export type NewSupplierFormProps = {
  onSuccess?: () => void;
};

export const NewSupplierForm: FC<NewSupplierFormProps> = props => {
  const createSupplier = supplierApi.create.useMutation({
    onSuccess: async () => {
      success('Thêm nhà cung cấp thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values => createSupplier.mutate(values)}
      defaultValues={{
        name: '',
        email: '',
        phone: '',
        address: '',
        note: ''
      }}
      loading={createSupplier.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'name'}
        title={'Tên nhà cung cấp'}
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
