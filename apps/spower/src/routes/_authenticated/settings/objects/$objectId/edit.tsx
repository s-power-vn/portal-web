import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { EditObjectForm } from '../../../../../components';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const { objectId } = Route.useParams();
  const search = Route.useSearch();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: api.object.byId.getKey(objectId)
      }),
      queryClient.invalidateQueries({
        queryKey: api.object.listFull.getKey()
      })
    ]);
  }, [history, queryClient, objectId]);

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
};

export const Route = createFileRoute(
  '/_authenticated/settings/objects/$objectId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { objectId } }) =>
    queryClient?.ensureQueryData(api.object.byId.getOptions(objectId))
});
