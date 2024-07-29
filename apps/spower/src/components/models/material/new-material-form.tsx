import { object, string } from 'yup';

import { FC } from 'react';

import {
  BusinessFormProps,
  Form,
  TextField,
  TextareaField,
  success
} from '@storeo/theme';

import { materialApi } from '../../../api';

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
  const createMaterial = materialApi.create.useMutation({
    onSuccess: async () => {
      success('Thêm vật tư thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values => createMaterial.mutate(values)}
      onCancel={props.onCancel}
      defaultValues={{
        code: '',
        name: '',
        unit: '',
        note: ''
      }}
      loading={createMaterial.isPending}
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
      <TextareaField
        schema={schema}
        name={'note'}
        title={'Ghi chú'}
        options={{}}
      />
    </Form>
  );
};
