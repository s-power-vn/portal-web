import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { EditEmployeeForm } from '../../../../../components';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { employeeId } = Route.useParams();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: api.employee.byId.getKey(employeeId)
      }),
      queryClient.invalidateQueries({
        queryKey: api.employee.list.getKey(search)
      }),
      queryClient.invalidateQueries({
        queryKey: api.employee.listFull.getKey()
      })
    ]);
  }, [employeeId, history, queryClient, search]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Chỉnh sửa nhân viên'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'edit-employee-modal'}
    >
      <EditEmployeeForm
        employeeId={employeeId}
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
};

export const Route = createFileRoute(
  '/_authenticated/settings/employees/$employeeId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { employeeId } }) =>
    queryClient?.ensureQueryData(api.employee.byId.getOptions(employeeId))
});
