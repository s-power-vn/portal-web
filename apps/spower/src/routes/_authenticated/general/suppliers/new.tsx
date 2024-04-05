import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { object, string } from 'yup';

import { useState } from 'react';

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

import { getSuppliersKey, useCreateSupplier } from '../../../../api';

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

  const createSupplier = useCreateSupplier(async () => {
    setOpen(false);
    history.back();
    await queryClient.invalidateQueries({
      queryKey: getSuppliersKey(search)
    });
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
          <DialogTitle>Thêm nhà cung cấp</DialogTitle>
          <DialogDescription className={'italic'}>
            Tạo nhà cung cấp mới.
          </DialogDescription>
        </DialogHeader>
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

export const Route = createFileRoute('/_authenticated/general/suppliers/new')({
  component: Component
});
