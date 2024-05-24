import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useCallback, useState } from 'react';

import { Modal } from '@storeo/theme';

import { supplierApi } from '../../../../api';
import { NewSupplierForm } from '../../../../components';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: supplierApi.list.getKey(search)
      })
    ]);
  }, [history, queryClient, search]);

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
      <NewSupplierForm onSuccess={onSuccessHandler} />
    </Modal>
  );
};

export const Route = createFileRoute('/_authenticated/general/suppliers/new')({
  component: Component
});
