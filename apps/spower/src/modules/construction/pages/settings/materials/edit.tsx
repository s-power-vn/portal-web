import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../../../hooks';
import { EditMaterialForm } from '../../../components/material';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { materialId } = Route.useParams();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(() => {
    setOpen(false);
    history.back();
    invalidates([
      api.material.byId.getKey(materialId),
      api.material.list.getKey()
    ]);
  }, [history, invalidates, materialId]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Chỉnh sửa vật tư'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'edit-material-modal'}
    >
      <EditMaterialForm
        materialId={materialId}
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
};

export const Route = createFileRoute(
  '/_private/settings/general/materials/$materialId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { materialId } }) =>
    queryClient?.ensureQueryData(api.material.byId.getOptions(materialId))
});
