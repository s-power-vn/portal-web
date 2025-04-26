import { departmentApi, employeeApi } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

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

export type EditEmployeeFormProps = BusinessFormProps & {
  employeeId: string;
};

export const EditEmployeeForm: FC<EditEmployeeFormProps> = props => {
  const { data: employee } = employeeApi.byId.useSuspenseQuery({
    variables: props.employeeId
  });

  const updateEmployee = employeeApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa nhân viên thành công');
      props.onSuccess?.();
    }
  });

  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >();

  useEffect(() => {
    setSelectedDepartment(employee.department?.id || undefined);
  }, [employee.department?.id]);

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
        updateEmployee.mutate({
          id: props.employeeId,
          user_id: values.user,
          name: values.name,
          department_id: values.department,
          department_role: values.role,
          department_title:
            roleItems.find(item => item.value === values.role)?.label || ''
        });
      }}
      onCancel={props.onCancel}
      defaultValues={{
        user: employee.user?.id,
        name: employee.name ? employee.name : employee.user?.name,
        department: employee.department?.id || '',
        role: employee.department?.role || ''
      }}
      loading={updateEmployee.isPending}
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
