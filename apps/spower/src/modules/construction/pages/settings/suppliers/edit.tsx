import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../../../hooks';
import { EditSupplierForm } from '../../../components/supplier';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { supplierId } = Route.useParams();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(() => {
    setOpen(false);
    history.back();
    invalidates([
      api.supplier.byId.getKey(supplierId),
      api.supplier.list.getKey()
    ]);
  }, [history, invalidates, supplierId]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Chỉnh sửa nhà cung cấp'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'edit-supplier-modal'}
    >
      <EditSupplierForm
        supplierId={supplierId}
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
};

export const Route = createFileRoute(
  '/_private/settings/general/suppliers/$supplierId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { supplierId } }) =>
    queryClient?.ensureQueryData(api.supplier.byId.getOptions(supplierId))
});
