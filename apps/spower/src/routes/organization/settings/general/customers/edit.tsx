import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { EditCustomerForm } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/general/customers/$customerId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { customerId } }) =>
    queryClient?.ensureQueryData(api.customer.byId.getOptions(customerId))
});

function Component() {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const { customerId } = Route.useParams();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(() => {
    setOpen(false);
    history.back();
    invalidates([
      api.customer.byId.getKey(customerId),
      api.customer.list.getKey()
    ]);
  }, [customerId, history, invalidates]);

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
}
