import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, success } from '@minhdtb/storeo-theme';

import { SelectEmployeeField } from '../employee/select-employee-field';

const schema = object().shape({
  user: string().required('Hãy chọn nhân viên')
});

export type AddConfirmerFormProps = BusinessFormProps;

export const AddConfirmerForm: FC<AddConfirmerFormProps> = props => {
  const addConfirmer = api.setting.addConfirmer.useMutation({
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
