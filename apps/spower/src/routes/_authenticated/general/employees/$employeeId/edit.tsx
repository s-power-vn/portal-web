import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useCallback, useState } from 'react';

import { Modal } from '@storeo/theme';

import { employeeApi } from '../../../../../api';
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
        queryKey: employeeApi.byId.getKey(employeeId)
      }),
      queryClient.invalidateQueries({
        queryKey: employeeApi.list.getKey(search)
      })
    ]);
  }, [employeeId, history, queryClient, search]);

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
      <EditEmployeeForm employeeId={employeeId} onSuccess={onSuccessHandler} />
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
