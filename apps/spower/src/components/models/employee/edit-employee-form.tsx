import _ from 'lodash';
import { departmentApi, employeeApi } from 'portal-api';
import { number, object, string } from 'yup';

import { FC, useEffect, useMemo, useState } from 'react';

import {
  BusinessFormProps,
  Form,
  TextField,
  success
} from '@minhdtb/storeo-theme';

import { DepartmentDropdownField } from '../department/department-dropdown-field';
import { RoleDropdownField } from '../role/role-dropdown-field';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban'),
  phone: string(),
  title: string(),
  role: number().required('Hãy chọn chức danh')
});

export type EditEmployeeFormProps = BusinessFormProps & {
  employeeId: string;
};

export const EditEmployeeForm: FC<EditEmployeeFormProps> = props => {
  const employee = employeeApi.byId.useSuspenseQuery({
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
    setSelectedDepartment(employee.data?.department);
  }, [employee.data?.department]);

  const department = departmentApi.byId.useQuery({
    variables: selectedDepartment,
    enabled: selectedDepartment !== undefined
  });

  const roleItems = useMemo(() => {
    if (department.data) {
      const code = department.data.code;
      return code === 'BGD'
        ? [
            {
              label: 'Giám đốc',
              value: '1'
            },
            {
              label: 'Phó giám đốc',
              value: '2'
            }
          ]
        : [
            {
              label: 'Trưởng phòng',
              value: '3'
            },
            {
              label: 'Chuyên viên',
              value: '4'
            }
          ];
    }
  }, [department]);

  return (
    <Form
      schema={schema}
      onSubmit={values =>
        updateEmployee.mutate({
          ...values,
          id: props.employeeId,
          title:
            _.find(roleItems, it => it.value === values.role?.toString())
              ?.label ?? ''
        })
      }
      onCancel={props.onCancel}
      defaultValues={{
        ...employee.data
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
            setSelectedDepartment(value);
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
