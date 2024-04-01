import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import PocketBase from 'pocketbase';
import { object, string } from 'yup';

import { useState } from 'react';

import { UserRecord, UserResponse, usePb } from '@storeo/core';
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

import { DepartmentDropdownField } from '../../../../../components';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban')
});

function getEmployee(id: string, pb?: PocketBase) {
  return pb?.collection('user').getOne<UserResponse>(id);
}

function employeeOptions(id: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['employee', id],
    queryFn: () => getEmployee(id, pb)
  });
}

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const pb = usePb();
  const queryClient = useQueryClient();
  const { employeeId } = Route.useParams();

  const employeeQuery = useSuspenseQuery(employeeOptions(employeeId, pb));

  const updateEmployee = useMutation({
    mutationKey: ['updateEmployee'],
    mutationFn: (params: UserRecord) =>
      pb.collection('user').update(employeeId, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['employees'] }),
        queryClient.invalidateQueries({ queryKey: ['employee', employeeId] })
      ]),
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
          <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
          <DialogDescription className={'italic'}>
            Chỉnh sửa thông tin nhân viên đang được lựa chọn.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values => updateEmployee.mutate(values)}
          defaultValues={employeeQuery.data}
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

export const Route = createFileRoute(
  '/_authenticated/general/employees/$employeeId/edit'
)({
  component: Component,
  loader: ({ context: { pb, queryClient }, params: { employeeId } }) =>
    queryClient?.ensureQueryData(employeeOptions(employeeId, pb))
});
