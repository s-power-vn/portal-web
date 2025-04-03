import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { EditDepartmentForm } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/_organization/settings/general/departments/$departmentId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { departmentId } }) =>
    queryClient?.ensureQueryData(api.department.byId.getOptions(departmentId))
});

function Component() {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { departmentId } = Route.useParams();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(() => {
    setOpen(false);
    history.back();
    invalidates([
      api.department.byId.getKey(departmentId),
      api.department.list.getKey()
    ]);
  }, [departmentId, history, invalidates]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Chỉnh sửa phòng ban'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'edit-department-modal'}
    >
      <EditDepartmentForm
        departmentId={departmentId}
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
}
