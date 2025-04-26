import { departmentApi, employeeApi } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';
import { useMemo, useState } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, success } from '@minhdtb/storeo-theme';

import { DepartmentDropdownField } from '../../department';
import { RoleDropdownField } from '../../role';

const schema = object().shape({
  user: string().required('Hãy chọn người dùng'),
  name: string().required('Hãy nhập họ tên'),
  department: string().required('Hãy chọn phòng ban'),
  role: string().required('Hãy chọn chức danh')
});

export type NewEmployeeFormProps = BusinessFormProps;

export const NewEmployeeForm: FC<NewEmployeeFormProps> = props => {
  const createEmployee = employeeApi.create.useMutation({
    onSuccess: async () => {
      success('Thêm nhân viên thành công');
      props.onSuccess?.();
    }
  });

  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >();

  const department = departmentApi.byId.useQuery({
    variables: selectedDepartment,
    enabled: selectedDepartment !== undefined
  });

  const roleItems = useMemo(() => {
    if (department.data?.roles && Array.isArray(department.data.roles)) {
      return department.data.roles.map(role => ({
        label: role.name,
        value: role.id
      }));
    }
    return [];
  }, [department.data]);

  return (
    <Form
      schema={schema}
      onSuccess={values => {
        const selectedRole = department.data?.roles?.find(
          role => role.id === values.role
        );

        createEmployee.mutate({
          user_id: values.user,
          name: values.name,
          department_id: values.department,
          department_role: selectedRole?.id,
          department_title: selectedRole?.name
        });
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: '',
        department: '',
        role: ''
      }}
      loading={createEmployee.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField schema={schema} name={'name'} title={'Họ tên'} options={{}} />
      <DepartmentDropdownField
        schema={schema}
        name={'department'}
        title={'Phòng ban'}
        options={{
          placeholder: 'Chọn phòng ban',
          onChange: value => {
            setSelectedDepartment(value as string);
          }
        }}
      />
      <RoleDropdownField
        schema={schema}
        name={'role'}
        title={'Chức danh'}
        options={{
          placeholder: 'Chọn chức danh',
          items: roleItems
        }}
      />
    </Form>
  );
};
