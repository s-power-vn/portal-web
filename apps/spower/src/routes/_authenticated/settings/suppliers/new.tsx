import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { NewSupplierForm } from '../../../../components';
import { useInvalidateQueries } from '../../../../hooks';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(() => {
    setOpen(false);
    history.back();
    invalidates([api.supplier.list.getKey()]);
  }, [history, invalidates]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Thêm nhà cung cấp'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'new-supplier-modal'}
    >
      <NewSupplierForm
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
};

export const Route = createFileRoute('/_authenticated/settings/suppliers/new')({
  component: Component
});
