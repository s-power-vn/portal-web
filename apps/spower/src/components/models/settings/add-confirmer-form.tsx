import { settingApi } from 'portal-api';
import { object, string } from 'yup';

import { FC } from 'react';

import { BusinessFormProps, Form, success } from '@minhdtb/storeo-theme';

import { SelectEmployeeField } from '../employee/select-employee-field';

const schema = object().shape({
  user: string().required('Hãy chọn nhân viên')
});

export type AddConfirmerFormProps = BusinessFormProps;

export const AddConfirmerForm: FC<AddConfirmerFormProps> = props => {
  const addConfirmer = settingApi.addConfirmer.useMutation({
    onSuccess: async () => {
      success('Thêm người xác nhận thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values => addConfirmer.mutate(values)}
      onCancel={props.onCancel}
      defaultValues={{
        user: ''
      }}
      loading={addConfirmer.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <SelectEmployeeField schema={schema} name={'user'} />
    </Form>
  );
};
