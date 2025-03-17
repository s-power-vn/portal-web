import { createFileRoute, useParams, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { EditProcessForm } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/settings/operation/process/$processId/edit'
)({
  component: RouteComponent
});

function RouteComponent() {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { processId } = useParams({ from: Route.id });
  const invalidates = useInvalidateQueries();

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
      className="h-full w-full max-w-[calc(80vw)]"
    >
      <EditProcessForm
        onCancel={() => history.back()}
        processId={processId}
        onSuccess={() => {
          invalidates([
            api.process.list.getKey(),
            api.process.byId.getKey(processId)
          ]);
          history.back();
        }}
      />
    </Modal>
  );
}
