import { api } from 'portal-api';
import { object, ref, string } from 'yup';

import type { FC } from 'react';
import { useMemo, useState } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, PasswordField, TextField, success } from '@minhdtb/storeo-theme';

import { DepartmentDropdownField } from '../../department';
import { RoleDropdownField } from '../../role';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban'),
  password: string()
    .required('Hãy nhập mật khẩu')
    .min(8, 'Mật khẩu dài ít nhất 8 ký tự'),
  passwordConfirmation: string()
    .oneOf([ref('password'), undefined], 'Mật khẩu không trùng nhau')
    .required('Hãy xác nhận mật khẩu'),
  title: string(),
  phone: string(),
  role: string().required('Hãy chọn chức danh')
});

export type NewEmployeeFormProps = BusinessFormProps;

export const NewEmployeeForm: FC<NewEmployeeFormProps> = props => {
  const createEmployee = api.employee.create.useMutation({
    onSuccess: async () => {
      success('Thêm nhân viên thành công');
      props.onSuccess?.();
    }
  });

  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >();

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

        createEmployee.mutate({
          ...values,
          title: selectedRole?.name || ''
        });
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: '',
        email: '',
        department: '',
        phone: ''
      }}
      loading={createEmployee.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField schema={schema} name={'name'} title={'Họ tên'} options={{}} />
      <TextField schema={schema} name={'email'} title={'Email'} />
      <TextField schema={schema} name={'phone'} title={'Số điện thoại'} />
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
      <PasswordField schema={schema} name={'password'} title={'Mật khẩu'} />
      <PasswordField
        schema={schema}
        name={'passwordConfirmation'}
        title={'Xác nhận mật khẩu'}
      />
    </Form>
  );
};
