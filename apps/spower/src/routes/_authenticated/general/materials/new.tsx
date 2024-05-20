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
  TextField,
  success
} from '@storeo/theme';

import { materialApi } from '../../../../api';

const schema = object().shape({
  code: string()
    .required('Hãy nhập mã vật liệu')
    .max(10, 'Mã vật liệu không vượt quá 10 ký tự'),
  name: string().required('Hãy nhập tên vật liệu'),
  unit: string().required('Hãy nhập đơn vị'),
  note: string()
});

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const createMaterial = materialApi.create.useMutation({
    onSuccess: async () => {
      success('Thêm vật liệu thành công');
      setOpen(false);
      history.back();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: materialApi.list.getKey(search)
        })
      ]);
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
          <DialogTitle>Thêm nhà cung cấp</DialogTitle>
          <DialogDescription className={'italic'}>
            Tạo nhà cung cấp mới.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values => createMaterial.mutate(values)}
          defaultValues={{
            code: '',
            name: '',
            unit: '',
            note: ''
          }}
          loading={createMaterial.isPending}
          className={'mt-4 flex flex-col gap-3'}
        >
          <TextField
            schema={schema}
            name={'code'}
            title={'Mã vật liệu'}
            options={{}}
          />
          <TextField
            schema={schema}
            name={'name'}
            title={'Tên vật liệu'}
            options={{}}
          />
          <TextField
            schema={schema}
            name={'unit'}
            title={'Đơn vị'}
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

export const Route = createFileRoute('/_authenticated/general/materials/new')({
  component: Component
});
