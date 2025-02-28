import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, success } from '@minhdtb/storeo-theme';

import { DepartmentDropdownField } from '../../department';
import { RoleDropdownField } from '../../role';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban'),
  phone: string(),
  title: string(),
  role: string().required('Hãy chọn chức danh')
});

export type EditEmployeeFormProps = BusinessFormProps & {
  employeeId: string;
};

export const EditEmployeeForm: FC<EditEmployeeFormProps> = props => {
  const employee = api.employee.byId.useSuspenseQuery({
    variables: props.employeeId
  });

  const updateEmployee = api.employee.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa nhân viên thành công');
      props.onSuccess?.();
    }
  });

  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >();

  useEffect(() => {
    setSelectedDepartment(employee.data?.expand?.department.id);
  }, [employee.data?.expand?.department.id]);

  const department = api.department.byId.useQuery({
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

        updateEmployee.mutate({
          ...values,
          id: props.employeeId,
          title: selectedRole?.name || ''
        });
      }}
      onCancel={props.onCancel}
      defaultValues={{
        ...employee.data,
        role: employee.data?.role
      }}
      loading={updateEmployee.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField schema={schema} name={'name'} title={'Họ tên'} options={{}} />
      <TextField
        schema={schema}
        name={'email'}
        title={'Email'}
        options={{
          disabled: true
        }}
      />
      <TextField
        schema={schema}
        name={'phone'}
        title={'Số điện thoại'}
        options={{}}
      />
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
