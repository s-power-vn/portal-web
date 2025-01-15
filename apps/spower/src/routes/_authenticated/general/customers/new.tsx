import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { NewCustomerForm } from '../../../../components';

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
        queryKey: api.customer.list.getKey(search)
      }),
      queryClient.invalidateQueries({
        queryKey: api.customer.listFull.getKey()
      })
    ]);
  }, [history, queryClient, search]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Thêm chủ đầu tư'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
    >
      <NewCustomerForm
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
};

export const Route = createFileRoute('/_authenticated/general/customers/new')({
  component: Component
});
