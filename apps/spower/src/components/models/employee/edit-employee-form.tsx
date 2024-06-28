import { boolean, object, string } from 'yup';

import { FC } from 'react';

import {
  Button,
  DatePickerField,
  Form,
  TextField,
  success
} from '@storeo/theme';

import { employeeApi } from '../../../api';
import { DepartmentDropdownField } from '../department/department-dropdown-field';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  department: string().required('Hãy chọn phòng ban'),
  title: string(),
  role: boolean()
});

export type EditEmployeeFormProps = {
  employeeId: string;
  onSuccess?: () => void;
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

  return (
    <Form
      schema={schema}
      onSubmit={values =>
        updateEmployee.mutate({
          ...values,
          id: props.employeeId,
          role: values.role ? 1 : 0
        })
      }
      defaultValues={{
        ...employee.data,
        role: employee.data.role === 1
      }}
      loading={updateEmployee.isPending}
      className={'mt-4 flex flex-col gap-3'}
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
      <div className={'mt-6 flex justify-end'}>
        <Button type="submit">Chấp nhận</Button>
      </div>
    </Form>
  );
};
