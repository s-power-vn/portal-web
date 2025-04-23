import { api } from 'portal-api';
import { object, string } from 'yup';

import { type FC, useCallback } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, TextareaField, success } from '@minhdtb/storeo-theme';

const schema = object().shape({
  code: string()
    .required('Hãy nhập mã vật tư')
    .max(10, 'Mã vật tư không vượt quá 10 ký tự'),
  name: string().required('Hãy nhập tên vật tư'),
  unit: string().required('Hãy nhập đơn vị'),
  note: string()
});

export type NewMaterialFormProps = BusinessFormProps;

export const NewMaterialForm: FC<NewMaterialFormProps> = props => {
  const createMaterial = api.material.create.useMutation({
    onSuccess: async () => {
      success('Thêm vật tư thành công');
      props.onSuccess?.();
    }
  });

  const handleFormSuccess = useCallback(
    (values: { code?: string; name: string; unit: string; note?: string }) => {
      createMaterial.mutate({
        code: values.code ?? '',
        name: values.name,
        unit: values.unit,
        note: values.note ?? ''
      });
    },
    [createMaterial]
  );

  return (
    <Form
      schema={schema}
      onSuccess={handleFormSuccess}
      onCancel={props.onCancel}
      defaultValues={{
        code: '',
        name: '',
        unit: '',
        note: ''
      }}
      loading={createMaterial.isPending}
      className={'flex flex-col gap-3'}
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
      <TextareaField
        schema={schema}
        name={'note'}
        title={'Ghi chú'}
        options={{}}
      />
    </Form>
  );
};
