import { object, string } from 'yup';

import { FC } from 'react';

import { Button, Form, TextField, success } from '@storeo/theme';

import { materialApi } from '../../../api';

const schema = object().shape({
  code: string()
    .required('Hãy nhập mã vật tư')
    .max(10, 'Mã vật tư không vượt quá 10 ký tự'),
  name: string().required('Hãy nhập tên vật tư'),
  unit: string().required('Hãy nhập đơn vị'),
  note: string()
});

export type EditMaterialFormProps = {
  materialId: string;
  onSuccess?: () => void;
};

export const EditMaterialForm: FC<EditMaterialFormProps> = props => {
  const materialById = materialApi.byId.useSuspenseQuery({
    variables: props.materialId
  });

  const updateMaterial = materialApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa vật tư thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values =>
        updateMaterial.mutate({
          id: props.materialId,
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
      <TextField schema={schema} name={'unit'} title={'Đơn vị'} options={{}} />
      <TextField schema={schema} name={'note'} title={'Ghi chú'} options={{}} />
      <div className={'mt-6 flex justify-end'}>
        <Button type="submit">Chấp nhận</Button>
      </div>
    </Form>
  );
};
