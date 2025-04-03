import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { NewEmployeeForm } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/general/employees/new'
)({
  component: Component
});

function Component() {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    invalidates([api.employee.list.getKey()]);
  }, [history, invalidates]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Thêm nhân viên'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'new-employee-modal'}
    >
      <NewEmployeeForm
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
}
