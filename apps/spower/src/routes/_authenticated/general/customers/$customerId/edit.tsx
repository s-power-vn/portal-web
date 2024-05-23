import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useCallback, useState } from 'react';

import { Modal } from '@storeo/theme';

import { customerApi } from '../../../../../api';
import { EditCustomerForm } from '../../../../../components';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { customerId } = Route.useParams();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: customerApi.byId.getKey(customerId)
      }),
      queryClient.invalidateQueries({
        queryKey: customerApi.list.getKey(search)
      })
    ]);
  }, [customerId, history, queryClient, search]);

  return (
    <Modal
      title={'Chỉnh sửa chủ đầu tư'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
    >
      <EditCustomerForm customerId={customerId} onSuccess={onSuccessHandler} />
    </Modal>
  );
};

export const Route = createFileRoute(
  '/_authenticated/general/customers/$customerId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { customerId } }) =>
    queryClient?.ensureQueryData(customerApi.byId.getOptions(customerId))
});
