import { boolean, object, ref, string } from 'yup';

import { FC } from 'react';

import {
  Button,
  DatePickerField,
  Form,
  PasswordField,
  TextField,
  success
} from '@storeo/theme';

import { employeeApi } from '../../../api';
import { DepartmentDropdownField } from '../department/department-dropdown-field';

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
  role: boolean()
});

export type NewEmployeeFormProps = {
  onSuccess?: () => void;
};

export const NewEmployeeForm: FC<NewEmployeeFormProps> = props => {
  const createEmployee = employeeApi.create.useMutation({
    onSuccess: async () => {
      success('Thêm nhân viên thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values =>
        createEmployee.mutate({
          ...values,
          role: values.role ? 1 : 0
        })
      }
      defaultValues={{
        name: '',
        email: '',
        department: ''
      }}
      loading={createEmployee.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <TextField schema={schema} name={'name'} title={'Họ tên'} options={{}} />
      <TextField schema={schema} name={'email'} title={'Email'} />
      <DepartmentDropdownField
        schema={schema}
        name={'department'}
        title={'Phòng ban'}
        options={{
          placeholder: 'Hãy chọn phòng ban'
        }}
      />
      <TextField schema={schema} name={'title'} title={'Chức danh'} />
      <CheckField
        schema={schema}
        name={'role'}
        options={{
          label: 'Quyền duyệt'
        }}
      />
      <PasswordField schema={schema} name={'password'} title={'Mật khẩu'} />
      <PasswordField
        schema={schema}
        name={'passwordConfirmation'}
        title={'Xác nhận mật khẩu'}
      />
      <div className={'mt-6 flex justify-end'}>
        <Button type="submit">Chấp nhận</Button>
      </div>
    </Form>
  );
};
