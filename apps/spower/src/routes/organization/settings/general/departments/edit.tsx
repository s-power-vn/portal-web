import { createFileRoute, useRouter } from '@tanstack/react-router';
import { departmentApi } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { EditDepartmentForm } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/general/departments/$departmentId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { departmentId } }) =>
    queryClient?.ensureQueryData(departmentApi.byId.getOptions(departmentId))
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
      departmentApi.byId.getKey(departmentId),
      departmentApi.list.getKey()
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
