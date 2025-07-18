import { api } from 'portal-api';
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

import { ProcessDropdownField } from '../../process';
import { ObjectTypeDropdownField } from '../field';

const schema = object().shape({
  name: string().required('Hãy nhập tên đối tượng'),
  description: string(),
  type: string().required('Hãy chọn loại đối tượng'),
  process: string().nullable(),
  active: boolean()
});

export type EditObjectFormProps = BusinessFormProps & {
  objectId: string;
};

export const EditObjectForm: FC<EditObjectFormProps> = props => {
  const { objectId } = props;

  const { data: objectData } = api.object.byId.useSuspenseQuery({
    variables: objectId
  });

  const updateObject = api.object.update.useMutation({
    onSuccess: async () => {
      success('Cập nhật đối tượng thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values => {
        const formData = {
          ...values,
          id: objectId,
          process: values.process || '',
          type: values.type
        };

        updateObject.mutate(formData);
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: objectData?.name || '',
        description: objectData?.description || '',
        type: objectData?.type || '',
        process: objectData?.process,
        active: objectData?.active ?? true
      }}
      loading={updateObject.isPending}
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
          disabled: true
        }}
      />
      <ProcessDropdownField
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
