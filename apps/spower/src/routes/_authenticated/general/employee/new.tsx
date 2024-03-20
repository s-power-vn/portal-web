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

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban')
});

const NewEmployee = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();

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
          <DialogDescription>
            Cho phép tạo nhân viên mới cho hệ thống.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          // onSubmit={({ email, password }) => login.mutate({ email, password })}
          defaultValues={{
            name: '',
            email: '',
            department: ''
          }}
          // loading={login.isPending}
          className={'flex flex-col gap-4'}
        >
          <TextField schema={schema} name={'name'} title={'Họ tên'} />
          <TextField schema={schema} name={'email'} title={'Email'} />
          <TextField schema={schema} name={'department'} title={'Phòng ban'} />
          <DialogFooter>
            <Button type="submit">Chấp nhận</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const Route = createFileRoute('/_authenticated/general/employee/new')({
  component: NewEmployee
});
