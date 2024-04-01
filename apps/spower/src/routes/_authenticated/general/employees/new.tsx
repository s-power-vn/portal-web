import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { object, string } from 'yup';

import { useState } from 'react';

import { UserRecord, usePb } from '@storeo/core';
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

import { DepartmentDropdownField } from '../../../../components';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban')
});

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const pb = usePb();
  const queryClient = useQueryClient();

  const createEmployee = useMutation({
    mutationKey: ['createEmployee'],
    mutationFn: (params: UserRecord) =>
      pb.collection<UserRecord>('user').create(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
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
          <DialogTitle>Thêm nhân viên</DialogTitle>
          <DialogDescription className={'italic'}>
            Tạo nhân viên mới cho hệ thống.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values => createEmployee.mutate(values)}
          defaultValues={{
            name: '',
            email: '',
            department: ''
          }}
          loading={createEmployee.isPending}
          className={'mt-4 flex flex-col gap-3'}
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
          <DepartmentDropdownField
            schema={schema}
            name={'department'}
            title={'Phòng ban'}
            options={{
              placeholder: 'Hãy chọn phòng ban'
            }}
          />
          <DialogFooter className={'mt-4'}>
            <Button type="submit">Chấp nhận</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const Route = createFileRoute('/_authenticated/general/employees/new')({
  component: Component
});
