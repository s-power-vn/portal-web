import { api } from 'portal-api';
import { ObjectTypeOptions } from 'portal-core';
import { boolean, object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import {
  CheckField,
  Form,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

import { ObjectTypeDropdownField } from '../field';

const schema = object().shape({
  name: string().required('Hãy nhập tên đối tượng'),
  description: string(),
  type: string().required('Hãy chọn loại đối tượng'),
  process: string().nullable(),
  active: boolean()
});

export type NewObjectFormProps = BusinessFormProps;

export const NewObjectForm: FC<NewObjectFormProps> = props => {
  const createObject = api.object.create.useMutation({
    onSuccess: async () => {
      success('Thêm đối tượng thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values => {
        const formData = {
          ...values,
          process: values.process || undefined,
          type: values.type as ObjectTypeOptions
        };
        createObject.mutate(formData);
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: '',
        description: '',
        type: ObjectTypeOptions.Request,
        process: null,
        active: false
      }}
      loading={createObject.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'name'}
        title={'Tên đối tượng'}
        options={{}}
      />
      <TextareaField
        schema={schema}
        name={'description'}
        title={'Mô tả'}
        options={{}}
      />
      <ObjectTypeDropdownField
        schema={schema}
        name={'type'}
        title={'Loại đối tượng'}
        options={{}}
      />
      <TextField
        schema={schema}
        name={'process'}
        title={'Quy trình'}
        options={{}}
      />
      <CheckField
        schema={schema}
        name={'active'}
        title={'Kích hoạt'}
        options={{}}
      />
    </Form>
  );
};
