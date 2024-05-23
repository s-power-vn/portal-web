import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { object, string } from 'yup';

import { useState } from 'react';

import { Button, Form, Modal, TextField, success } from '@storeo/theme';

import { supplierApi } from '../../../../../api';

const schema = object().shape({
  name: string().required('Hãy nhập tên chủ đầu tư'),
  email: string().email('Sai định dạng email'),
  phone: string(),
  address: string(),
  note: string()
});

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const { supplierId } = Route.useParams();
  const search = Route.useSearch();

  const supplierById = supplierApi.byId.useSuspenseQuery({
    variables: supplierId
  });

  const updateSupplier = supplierApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa nhà cung cấp thành công');
      setOpen(false);
      history.back();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: supplierApi.list.getKey(search)
        }),
        queryClient.invalidateQueries({
          queryKey: supplierApi.byId.getKey(supplierId)
        })
      ]);
    }
  });

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
      <Form
        schema={schema}
        onSubmit={values =>
          updateSupplier.mutate({
            id: supplierId,
            ...values
          })
        }
        defaultValues={supplierById.data}
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
        <div className={'mt-6 flex justify-end'}>
          <Button type="submit">Chấp nhận</Button>
        </div>
      </Form>
    </Modal>
  );
};

export const Route = createFileRoute(
  '/_authenticated/general/suppliers/$supplierId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { supplierId } }) =>
    queryClient?.ensureQueryData(supplierApi.byId.getOptions(supplierId))
});
