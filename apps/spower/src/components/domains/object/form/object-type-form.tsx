import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, TextareaField, success } from '@minhdtb/storeo-theme';

const schema = object().shape({
  name: string().required('Hãy nhập tên loại đối tượng'),
  description: string(),
  color: string(),
  icon: string()
});

export type ObjectTypeFormProps = BusinessFormProps & {
  objectTypeId?: string;
};

export const ObjectTypeForm: FC<ObjectTypeFormProps> = props => {
  const { objectTypeId } = props;
  const isEdit = !!objectTypeId;

  const { data: objectTypeData } = isEdit
    ? api.objectType.byId.useSuspenseQuery({
        variables: objectTypeId
      })
    : { data: null };

  const createObjectType = api.objectType.create.useMutation({
    onSuccess: async () => {
      success('Thêm loại đối tượng thành công');
      props.onSuccess?.();
    }
  });

  const updateObjectType = api.objectType.update.useMutation({
    onSuccess: async () => {
      success('Cập nhật loại đối tượng thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values => {
        if (isEdit) {
          const formData = {
            ...values,
            id: objectTypeId
          };
          updateObjectType.mutate(formData);
        } else {
          createObjectType.mutate(values);
        }
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: objectTypeData?.name || '',
        description: objectTypeData?.description || '',
        color: objectTypeData?.color || '#888888',
        icon: objectTypeData?.icon || ''
      }}
      loading={createObjectType.isPending || updateObjectType.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'name'}
        title={'Tên loại đối tượng'}
        options={{}}
      />
      <TextField
        schema={schema}
        name={'color'}
        title={'Màu sắc (mã hex)'}
        options={{
          type: 'color'
        }}
      />
      <TextField
        schema={schema}
        name={'icon'}
        title={'Icon (SVG)'}
        options={{}}
      />
      <TextareaField
        schema={schema}
        name={'description'}
        title={'Mô tả'}
        options={{}}
      />
    </Form>
  );
};
