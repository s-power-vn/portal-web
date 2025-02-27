import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { EditCustomerForm } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { customerId } = Route.useParams();
  const search = Route.useSearch();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    invalidates([api.customer.byId.getKey(customerId)]);
    invalidates([api.customer.list.getKey(search)]);
  }, [customerId, history, invalidates, search]);

  const onCancelHandler = useCallback(() => {
    setOpen(false);
    history.back();
  }, [history]);

  return (
    <Modal
      title={'Chỉnh sửa chủ đầu tư'}
      preventOutsideClick={true}
      open={open}
      setOpen={open => {
        setOpen(open);
        history.back();
      }}
      id={'edit-customer-modal'}
    >
      <EditCustomerForm
        customerId={customerId}
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
};

export const Route = createFileRoute(
  '/_authenticated/settings/customers/$customerId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { customerId } }) =>
    queryClient?.ensureQueryData(api.customer.byId.getOptions(customerId))
});
