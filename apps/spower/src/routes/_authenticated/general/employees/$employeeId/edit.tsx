import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { boolean, object, string } from 'yup';

import { useState } from 'react';

import {
  Button,
  CheckField,
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

import { employeeApi } from '../../../../../api';
import { DepartmentDropdownField } from '../../../../../components';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban'),
  title: string(),
  role: boolean()
});
const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { employeeId } = Route.useParams();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const employee = employeeApi.byId.useSuspenseQuery({
    variables: employeeId
  });

  const updateEmployee = employeeApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa nhân viên thành công');
      setOpen(false);
      history.back();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: employeeApi.list.getKey(search)
        }),
        queryClient.invalidateQueries({
          queryKey: employeeApi.byId.getKey(employeeId)
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
          <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
          <DialogDescription className={'italic'}>
            Chỉnh sửa thông tin nhân viên đang được lựa chọn.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values =>
            updateEmployee.mutate({
              ...values,
              id: employeeId,
              role: values.role ? 1 : 0
            })
          }
          defaultValues={{
            ...employee.data,
            role: employee.data.role === 1
          }}
          loading={updateEmployee.isPending}
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
            options={{
              disabled: true
            }}
          />
          <DepartmentDropdownField
            schema={schema}
            name={'department'}
            title={'Phòng ban'}
            options={{
              placeholder: 'Hãy chọn phòng ban'
            }}
          />
          <TextField schema={schema} name={'title'} title={'Chức danh'} />
          <CheckField
            schema={schema}
            name={'role'}
            options={{
              label: 'Quyền duyệt'
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

export const Route = createFileRoute(
  '/_authenticated/general/employees/$employeeId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { employeeId } }) =>
    queryClient?.ensureQueryData(employeeApi.byId.getOptions(employeeId))
});
