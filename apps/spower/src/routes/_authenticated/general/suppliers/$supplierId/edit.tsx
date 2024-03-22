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

import { SupplierRecord, SupplierResponse, usePb } from '@storeo/core';
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

function getSupplier(id: string, pb?: PocketBase) {
  return pb?.collection<SupplierResponse>('supplier').getOne(id);
}

function supplierOptions(id: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['supplier', id],
    queryFn: () => getSupplier(id, pb)
  });
}

const EditSupplier = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const pb = usePb();
  const queryClient = useQueryClient();
  const { supplierId } = Route.useParams();

  const supplierQuery = useSuspenseQuery(supplierOptions(supplierId, pb));

  const updateSupplier = useMutation({
    mutationKey: ['updateSupplier'],
    mutationFn: (params: SupplierRecord) =>
      pb.collection('supplier').update(supplierId, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
        queryClient.invalidateQueries({ queryKey: ['supplier', supplierId] })
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
          <DialogDescription>
            Cho phép chỉnh sửa thông tin nhà cung cấp hiện tại.
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
  component: EditSupplier,
  loader: ({ context: { pb, queryClient }, params: { supplierId } }) =>
    queryClient?.ensureQueryData(supplierOptions(supplierId, pb))
});
