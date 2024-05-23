import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { object, string } from 'yup';

import { useState } from 'react';

import { Button, Form, Modal, TextField, success } from '@storeo/theme';

import { materialApi } from '../../../../../api';

const schema = object().shape({
  code: string()
    .required('Hãy nhập mã vật tư')
    .max(10, 'Mã vật tư không vượt quá 10 ký tự'),
  name: string().required('Hãy nhập tên vật tư'),
  unit: string().required('Hãy nhập đơn vị'),
  note: string()
});

const Component = () => {
  const [open, setOpen] = useState(true);
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const { materialId } = Route.useParams();
  const search = Route.useSearch();

  const materialById = materialApi.byId.useSuspenseQuery({
    variables: materialId
  });

  const updateMaterial = materialApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa nhà cung cấp thành công');
      setOpen(false);
      history.back();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: materialApi.list.getKey(search)
        }),
        queryClient.invalidateQueries({
          queryKey: materialApi.byId.getKey(materialId)
        })
      ]);
    }
  });

  return (
    <Modal
      title={'Chỉnh sửa vật tư'}
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
          updateMaterial.mutate({
            id: materialId,
            ...values
          })
        }
        defaultValues={materialById.data}
        loading={updateMaterial.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={schema}
          name={'code'}
          title={'Mã vật tư'}
          options={{}}
        />
        <TextField
          schema={schema}
          name={'name'}
          title={'Tên vật tư'}
          options={{}}
        />
        <TextField
          schema={schema}
          name={'unit'}
          title={'Đơn vị'}
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
  '/_authenticated/general/materials/$materialId/edit'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { materialId } }) =>
    queryClient?.ensureQueryData(materialApi.byId.getOptions(materialId))
});
