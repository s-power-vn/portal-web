import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { NewMaterialForm } from '../../../../components';
import { useInvalidateQueries } from '../../../../hooks';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    invalidates([api.material.list.getKey()]);
  }, [history, invalidates]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Thêm vật tư'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'new-material-modal'}
    >
      <NewMaterialForm
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
};

export const Route = createFileRoute('/_authenticated/settings/materials/new')({
  component: Component
});
