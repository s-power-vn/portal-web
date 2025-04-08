import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import {
  BusinessFormProps,
  Form,
  TextField,
  error,
  success
} from '@minhdtb/storeo-theme';

import { ObjectTypeDropdownField } from '../../object';

const schema = object().shape({
  name: string().required('Tên quy trình là bắt buộc'),
  objectType: string().required('Loại đối tượng là bắt buộc')
});

export type NewProcessFormProps = BusinessFormProps;

export const NewProcessForm: FC<NewProcessFormProps> = props => {
  const createProcess = api.process.create.useMutation({
    onSuccess: () => {
      success('Quy trình đã được tạo thành công');
      props.onSuccess?.();
    },
    onError: () => {
      error('Tạo quy trình thất bại');
    }
  });

  return (
    <Form
      schema={schema}
      {...props}
      onSuccess={values => {
        createProcess.mutate({
          name: values.name,
          object_type_id: values.objectType
        });
      }}
      defaultValues={{
        name: '',
        objectType: ''
      }}
      className="flex flex-col gap-3"
      loading={createProcess.isPending}
    >
      <TextField schema={schema} name="name" title="Tên quy trình" />
      <ObjectTypeDropdownField
        schema={schema}
        name="objectType"
        title="Loại đối tượng"
      />
    </Form>
  );
};
