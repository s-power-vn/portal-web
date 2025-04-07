import { api } from 'portal-api';
import { v4 as uuidv4 } from 'uuid';
import { array, object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, TextareaField, success } from '@minhdtb/storeo-theme';

import { RolesField } from '../field/roles-field';

const schema = object().shape({
  name: string().required('Hãy nhập tên phòng ban'),
  description: string(),
  roles: array().of(
    object().shape({
      id: string().required(),
      name: string().required('Hãy nhập tên vai trò')
    })
  )
});

export type NewDepartmentFormProps = BusinessFormProps;

export const NewDepartmentForm: FC<NewDepartmentFormProps> = props => {
  const createDepartment = api.department.create.useMutation({
    onSuccess: async () => {
      success('Thêm phòng ban thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values => {
        createDepartment.mutate({
          ...values
        });
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: '',
        description: '',
        roles: [
          {
            id: uuidv4(),
            name: 'Trưởng phòng'
          },
          {
            id: uuidv4(),
            name: 'Phó phòng'
          },
          {
            id: uuidv4(),
            name: 'Nhân viên'
          }
        ]
      }}
      loading={createDepartment.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'name'}
        title={'Tên phòng ban'}
        options={{}}
      />
      <TextareaField
        schema={schema}
        name={'description'}
        title={'Mô tả'}
        options={{}}
      />
      <RolesField schema={schema} name={'roles'} options={{}} />
    </Form>
  );
};
