import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

export const Route = createFileRoute(
  '/_authenticated/settings/process/$processId/edit'
)({
  component: RouteComponent
});

function RouteComponent() {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();

  return (
    <Modal
      id={'process-edit'}
      title={'Chỉnh sửa quy trình'}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      preventOutsideClick={true}
    >
      <div>Hello "/_authenticated/settings/process/$processId/edit"!</div>
    </Modal>
  );
}
