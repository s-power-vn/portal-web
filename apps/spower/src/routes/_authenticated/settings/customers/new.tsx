import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback, useState } from 'react';

import { Modal } from '@minhdtb/storeo-theme';

import { NewCustomerForm } from '../../../../components';
import { useInvalidateQueries } from '../../../../hooks';

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const search = Route.useSearch();
  const invalidates = useInvalidateQueries();

  const onSuccessHandler = useCallback(async () => {
    setOpen(false);
    history.back();
    invalidates([api.customer.list.getKey(search)]);
  }, [history, invalidates, search]);

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
      id={'new-customer-modal'}
    >
      <NewCustomerForm
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  );
};

export const Route = createFileRoute('/_authenticated/settings/customers/new')({
  component: Component
});
