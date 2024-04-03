import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { object, string } from 'yup';

import { useState } from 'react';

import { SupplierRecord, SupplierResponse, client } from '@storeo/core';
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

function getSupplierOptions(supplierId: string) {
  return queryOptions({
    queryKey: ['getSupplier', supplierId],
    queryFn: () =>
      client.collection<SupplierResponse>('supplier').getOne(supplierId)
  });
}

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const { supplierId } = Route.useParams();

  const supplierQuery = useSuspenseQuery(getSupplierOptions(supplierId));

  const updateSupplier = useMutation({
    mutationKey: ['updateSupplier'],
    mutationFn: (params: SupplierRecord) =>
      client.collection('supplier').update(supplierId, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['getSuppliers'] }),
        queryClient.invalidateQueries({ queryKey: ['getSupplier', supplierId] })
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
          <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
          <DialogDescription className={'italic'}>
            Chỉnh sửa thông tin nhà cung cấp đang được lựa chọn.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values => updateSupplier.mutate(values)}
          defaultValues={supplierQuery.data}
          loading={updateSupplier.isPending}
          className={'mt-4 flex flex-col gap-3'}
        >
          <TextField
            schema={schema}
            name={'name'}
            title={'Tên nhà cung cấp'}
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
  '/_authenticated/general/suppliers/$supplierId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { supplierId } }) =>
    queryClient?.ensureQueryData(getSupplierOptions(supplierId))
});
