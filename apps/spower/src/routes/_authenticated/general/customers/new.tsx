import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useCallback, useState } from 'react';

import { Modal } from '@storeo/theme';

import { customerApi } from '../../../../api';
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
        queryKey: customerApi.list.getKey(search)
      })
    ]);
  }, [history, queryClient, search]);

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
      <NewCustomerForm onSuccess={onSuccessHandler} />
    </Modal>
  );
};

export const Route = createFileRoute('/_authenticated/general/customers/new')({
  component: Component
});
