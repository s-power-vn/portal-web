import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useCallback, useState } from 'react';

import { Modal } from '@storeo/theme';

import { supplierApi } from '../../../../../api';
import { EditSupplierForm } from '../../../../../components';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const { supplierId } = Route.useParams();
  const search = Route.useSearch();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: supplierApi.list.getKey(search)
      }),
      queryClient.invalidateQueries({
        queryKey: supplierApi.byId.getKey(supplierId)
      })
    ]);
  }, [history, queryClient, search, supplierId]);

  return (
    <Modal
      title={'Chỉnh sửa nhà cung cấp'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
    >
      <EditSupplierForm supplierId={supplierId} onSuccess={onSuccessHandler} />
    </Modal>
  );
};

export const Route = createFileRoute(
  '/_authenticated/general/suppliers/$supplierId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { supplierId } }) =>
    queryClient?.ensureQueryData(supplierApi.byId.getOptions(supplierId))
});
