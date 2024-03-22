import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { object, string } from 'yup';

import { useState } from 'react';

import { CustomersRecord, CustomersResponse, usePb } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  TextField
} from '@storeo/theme';

const schema = object().shape({
  name: string().required('Hãy nhập tên chủ đầu tư'),
  email: string().email('Sai định dạng email'),
  phone: string(),
  address: string(),
  note: string()
});

const NewCustomer = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const pb = usePb();
  const queryClient = useQueryClient();

  const createCustomer = useMutation({
    mutationKey: ['createCustomer'],
    mutationFn: (params: CustomersRecord) =>
      pb.collection('customers').create<CustomersResponse>(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
    onSettled: () => {
      setOpen(false);
      history.back();
    }
  });

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        setOpen(open);
        history.back();
      }}
    >
      <DialogContent className="w-1/4">
        <DialogHeader>
          <DialogTitle>Thêm chủ đầu tư</DialogTitle>
          <DialogDescription>Cho phép tạo chủ đầu tư mới.</DialogDescription>
        </DialogHeader>
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
          className={'mt-4 flex flex-col gap-2'}
        >
          <TextField
            schema={schema}
            name={'name'}
            title={'Họ tên'}
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
          <DialogFooter className={'mt-4'}>
            <Button type="submit">Chấp nhận</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const Route = createFileRoute('/_authenticated/general/customers/new')({
  component: NewCustomer
});
