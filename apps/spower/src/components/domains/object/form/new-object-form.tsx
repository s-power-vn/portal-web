import { api } from 'portal-api';
import { boolean, object, string } from 'yup';

import { type FC, useState } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import {
  CheckField,
  Form,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../../hooks';
import { ProcessDropdownField } from '../../process';
import { ObjectTypeDropdownField } from '../field';

const schema = object().shape({
  name: string().required('Hãy nhập tên đối tượng'),
  description: string(),
  type: string().required('Hãy chọn loại đối tượng'),
  process: string(),
  active: boolean()
});

export type NewObjectFormProps = BusinessFormProps;

export const NewObjectForm: FC<NewObjectFormProps> = props => {
  const [selectedObjectType, setSelectedObjectType] = useState<
    string | undefined
  >();

  const invalidates = useInvalidateQueries();

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
          name: values.name,
          description: values.description,
          active: values.active,
          process_id: values.process,
          object_type_id: values.type
        };
        createObject.mutate(formData);
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: '',
        description: '',
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
        options={{
          onChange: value => {
            setSelectedObjectType(value as string);
          }
        }}
      />
      <ProcessDropdownField
        schema={schema}
        name={'process'}
        title={'Quy trình'}
        options={{
          objectType: selectedObjectType
        }}
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
