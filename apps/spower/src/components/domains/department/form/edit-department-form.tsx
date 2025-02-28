import { api } from 'portal-api';
import { array, object, string } from 'yup';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, TextareaField, success } from '@minhdtb/storeo-theme';

import { type Role } from '../field/roles';
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

export type EditDepartmentFormProps = BusinessFormProps & {
  departmentId: string;
};

export const EditDepartmentForm: FC<EditDepartmentFormProps> = props => {
  const [roles, setRoles] = useState<Role[]>([]);

  const department = api.department.byId.useSuspenseQuery({
    variables: props.departmentId
  });

  useEffect(() => {
    if (department.data?.roles) {
      setRoles(department.data.roles as Role[]);
    }
  }, [department.data]);

  const updateDepartment = api.department.update.useMutation({
    onSuccess: async () => {
      success('Cập nhật phòng ban thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values => {
        updateDepartment.mutate({
          ...values,
          id: props.departmentId,
          roles: roles
        });
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: department.data?.name || '',
        description: department.data?.description || '',
        roles: (department.data?.roles as Role[]) || []
      }}
      loading={updateDepartment.isPending}
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
      <RolesField
        schema={schema}
        name={'roles'}
        options={{
          value: roles,
          onChange: setRoles
        }}
      />
    </Form>
  );
};
