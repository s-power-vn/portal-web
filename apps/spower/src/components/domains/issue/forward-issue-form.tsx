import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextareaField, success } from '@minhdtb/storeo-theme';

import { SelectEmployeeByConditionField } from './select-employee-by-condition-field';

const schema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  assignee: string().required('Hãy chọn nhân viên'),
  status: string().required('Hãy chọn status')
});

export type ForwardIssueFormProps = BusinessFormProps & {
  title: string;
  status: string;
  condition?: string;
};

export const ForwardIssueForm: FC<ForwardIssueFormProps> = props => {
  const updateRequest = api.request.updateStatus.useMutation({
    onSuccess: async () => {
      success('Cập nhật thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      className={'mt-2 flex flex-col gap-4'}
      schema={schema}
      onCancel={props.onCancel}
      loading={updateRequest.isPending}
    >
      <SelectEmployeeByConditionField
        schema={schema}
        name={'assignee'}
        title={props.title}
        options={{
          className: 'w-full',
          condition: props.condition
        }}
      />
      <TextareaField schema={schema} name={'note'} title={'Ghi chú'} />
    </Form>
  );
};
