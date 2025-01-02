import { BusinessFormProps, Form, success } from '@minhdtb/storeo-theme';
import { object, string } from 'yup';

import { FC } from 'react';

import { settingApi } from '../../../api';
import { SelectEmployeeField } from '../employee/select-employee-field';

const schema = object().shape({
  user: string().required('Hãy chọn nhân viên')
});

export type AddApproverFormProps = BusinessFormProps;

export const AddApproverForm: FC<AddApproverFormProps> = props => {
  const addApprover = settingApi.addApprover.useMutation({
    onSuccess: async () => {
      success('Thêm người phê duyệt thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values => addApprover.mutate(values)}
      onCancel={props.onCancel}
      defaultValues={{
        user: ''
      }}
      loading={addApprover.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <SelectEmployeeField schema={schema} name={'user'} />
    </Form>
  );
};
