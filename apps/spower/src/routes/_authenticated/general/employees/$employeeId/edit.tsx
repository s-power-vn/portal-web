import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { boolean, object, string } from 'yup';

import { useState } from 'react';

import {
  Button,
  CheckField,
  Form,
  Modal,
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
          queryKey: employeeApi.byId.getKey(employeeId)
        }),
        queryClient.invalidateQueries({
          queryKey: employeeApi.list.getKey(search)
        })
      ]);
    }
  });

  return (
    <Modal
      title={'Chỉnh sửa nhân viên'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
    >
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
        <div className={'mt-6 flex justify-end'}>
          <Button type="submit">Chấp nhận</Button>
        </div>
      </Form>
    </Modal>
  );
};

export const Route = createFileRoute(
  '/_authenticated/general/employees/$employeeId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { employeeId } }) =>
    queryClient?.ensureQueryData(employeeApi.byId.getOptions(employeeId))
});
