import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import PocketBase from 'pocketbase';
import { object, string } from 'yup';

import { useState } from 'react';

import { CustomerRecord, CustomerResponse, usePb } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  TextField
} from '@storeo/theme';

const schema = object().shape({
  name: string().required('Hãy nhập tên chủ đầu tư'),
  email: string().email('Sai định dạng email'),
  phone: string(),
  address: string(),
  note: string()
});

function getCustomer(id: string, pb?: PocketBase) {
  return pb?.collection<CustomerResponse>('customer').getOne(id);
}

function customerOptions(id: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['customer', id],
    queryFn: () => getCustomer(id, pb)
  });
}

const EditCustomer = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const pb = usePb();
  const queryClient = useQueryClient();
  const { customerId } = Route.useParams();

  const customerQuery = useSuspenseQuery(customerOptions(customerId, pb));

  const updateCustomer = useMutation({
    mutationKey: ['updateCustomer'],
    mutationFn: (params: CustomerRecord) =>
      pb.collection('customer').update(customerId, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['customers'] }),
        queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
      ]),
    onSettled: () => {
      setOpen(false);
      history.back();
    }
  });

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        setOpen(open);
        history.back();
      }}
    >
      <DialogContent className="w-1/4">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chủ đầu tư</DialogTitle>
          <DialogDescription>
            Cho phép chỉnh sửa thông tin chủ đầu tư hiện tại.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values => updateCustomer.mutate(values)}
          defaultValues={customerQuery.data}
          loading={updateCustomer.isPending}
          className={'mt-4 flex flex-col gap-2'}
        >
          <TextField
            schema={schema}
            name={'name'}
            title={'Tên chủ đầu tư'}
            options={{}}
          />
          <TextField
            schema={schema}
            name={'email'}
            title={'Email'}
            options={{}}
          />
          <TextField
            schema={schema}
            name={'phone'}
            title={'Số điện thoại'}
            options={{}}
          />
          <TextField
            schema={schema}
            name={'address'}
            title={'Địa chỉ'}
            options={{}}
          />
          <TextField
            schema={schema}
            name={'note'}
            title={'Ghi chú'}
            options={{}}
          />
          <DialogFooter className={'mt-4'}>
            <Button type="submit">Chấp nhận</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const Route = createFileRoute(
  '/_authenticated/general/customers/$customerId/edit'
)({
  component: EditCustomer,
  loader: ({ context: { pb, queryClient }, params: { customerId } }) =>
    queryClient?.ensureQueryData(customerOptions(customerId, pb))
});
