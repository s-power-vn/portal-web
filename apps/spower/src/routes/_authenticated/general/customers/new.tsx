import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { object, string } from 'yup';

import { useState } from 'react';

import { Button, Form, Modal, TextField, success } from '@storeo/theme';

import { customerApi } from '../../../../api';

const schema = object().shape({
  name: string().required('Hãy nhập tên chủ đầu tư'),
  email: string().email('Sai định dạng email'),
  phone: string(),
  address: string(),
  note: string()
});

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const createCustomer = customerApi.create.useMutation({
    onSuccess: async () => {
      success('Thêm chủ đầu tư thành công');
      setOpen(false);
      history.back();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: customerApi.list.getKey(search)
        })
      ]);
    }
  });

  return (
    <Modal
      title={'Thêm chủ đầu tư'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
    >
      <Form
        schema={schema}
        onSubmit={values => createCustomer.mutate(values)}
        defaultValues={{
          name: '',
          email: '',
          phone: '',
          address: '',
          note: ''
        }}
        loading={createCustomer.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={schema}
          name={'name'}
          title={'Tên chủ đầu tư'}
          options={{}}
        />
        <TextField
          schema={schema}
          name={'email'}
          title={'Email'}
          options={{}}
        />
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
        <TextField
          schema={schema}
          name={'note'}
          title={'Ghi chú'}
          options={{}}
        />
        <div className={'mt-6 flex justify-end'}>
          <Button type="submit">Chấp nhận</Button>
        </div>
      </Form>
    </Modal>
  );
};

export const Route = createFileRoute('/_authenticated/general/customers/new')({
  component: Component
});
