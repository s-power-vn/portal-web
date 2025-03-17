import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { NewProcessForm } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/settings/operation/process/new'
)({
  component: RouteComponent
});

function RouteComponent() {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const invalidates = useInvalidateQueries();

  const handleSuccess = useCallback(() => {
    history.back();
    invalidates([api.process.list.getKey()]);
  }, [history, invalidates]);

  const handleCancel = useCallback(() => {
    history.back();
  }, [history]);

  return (
    <Modal
      id={'process-new'}
      title={'Thêm quy trình'}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      preventOutsideClick={true}
    >
      <NewProcessForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </Modal>
  );
}
