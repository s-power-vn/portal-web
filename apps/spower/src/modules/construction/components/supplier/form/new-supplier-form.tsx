import { api } from 'portal-api';
import { object, string } from 'yup';

import { type FC, useCallback } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, TextareaField, success } from '@minhdtb/storeo-theme';

const schema = object().shape({
  name: string().required('Hãy nhập tên nhà cung cấp'),
  code: string(),
  email: string().email('Sai định dạng email'),
  phone: string(),
  address: string(),
  note: string()
});

export type NewSupplierFormProps = BusinessFormProps;

export const NewSupplierForm: FC<NewSupplierFormProps> = props => {
  const createSupplier = api.supplier.create.useMutation({
    onSuccess: async () => {
      success('Thêm nhà cung cấp thành công');
      props.onSuccess?.();
    }
  });

  const handleFormSuccess = useCallback(
    (values: {
      code?: string;
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      note?: string;
    }) => {
      createSupplier.mutate({
        code: values.code ?? '',
        name: values.name,
        email: values.email ?? '',
        phone: values.phone ?? '',
        address: values.address ?? '',
        note: values.note ?? ''
      });
    },
    [createSupplier]
  );

  return (
    <Form
      schema={schema}
      onSuccess={handleFormSuccess}
      onCancel={props.onCancel}
      defaultValues={{
        name: '',
        code: '',
        email: '',
        phone: '',
        address: '',
        note: ''
      }}
      loading={createSupplier.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'code'}
        title={'Mã nhà cung cấp'}
        options={{}}
      />
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
      <TextareaField
        schema={schema}
        name={'note'}
        title={'Ghi chú'}
        options={{}}
      />
    </Form>
  );
};
