import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { object, ref, string } from 'yup';

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
  PasswordField,
  TextField
} from '@storeo/theme';

import { getEmployeesKey, useCreateEmployee } from '../../../../api';
import { DepartmentDropdownField } from '../../../../components';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban'),
  password: string()
    .required('Hãy nhập mật khẩu')
    .min(8, 'Mật khẩu dài ít nhất 8 ký tự'),
  passwordConfirmation: string()
    .oneOf([ref('password'), undefined], 'Mật khẩu không trùng nhau')
    .required('Hãy xác nhận mật khẩu')
});

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const createEmployee = useCreateEmployee(async () => {
    setOpen(false);
    history.back();
    await queryClient.invalidateQueries({
      queryKey: getEmployeesKey(search)
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
          <TextField schema={schema} name={'email'} title={'Email'} />
          <DepartmentDropdownField
            schema={schema}
            name={'department'}
            title={'Phòng ban'}
            options={{
              placeholder: 'Hãy chọn phòng ban'
            }}
          />
          <PasswordField schema={schema} name={'password'} title={'Mật khẩu'} />
          <PasswordField
            schema={schema}
            name={'passwordConfirmation'}
            title={'Xác nhận mật khẩu'}
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
