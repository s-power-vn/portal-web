import { object, string } from 'yup';

import { FC } from 'react';

import { Button, Form, success } from '@storeo/theme';

import { settingApi } from '../../../api';
import { SelectEmployeeField } from '../employee/select-employee-field';

const schema = object().shape({
  user: string().required('Hãy chọn nhân viên')
});

export type AddConfirmerFormProps = {
  onSuccess?: () => void;
};

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
      defaultValues={{
        user: ''
      }}
      loading={addConfirmer.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <SelectEmployeeField schema={schema} name={'user'} />
      <div className={'mt-6 flex justify-end'}>
        <Button type="submit">Chấp nhận</Button>
      </div>
    </Form>
  );
};
