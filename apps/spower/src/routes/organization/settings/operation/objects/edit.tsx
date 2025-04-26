import { createFileRoute, useRouter } from '@tanstack/react-router';
import { objectApi } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { EditObjectForm } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/operation/objects/$objectId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { objectId } }) =>
    queryClient?.ensureQueryData(objectApi.byId.getOptions(objectId))
});

function Component() {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const invalidates = useInvalidateQueries();
  const { objectId } = Route.useParams();

  const onSuccessHandler = useCallback(() => {
    setOpen(false);
    history.back();
    invalidates([objectApi.list.getKey(), objectApi.byId.getKey(objectId)]);
  }, [history, invalidates, objectId]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Chỉnh sửa đối tượng'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'edit-object-modal'}
    >
      <EditObjectForm
        objectId={objectId}
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
}
