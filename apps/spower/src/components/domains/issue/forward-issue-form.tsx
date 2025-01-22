import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextareaField, error, success } from '@minhdtb/storeo-theme';

import { SelectEmployeeByConditionField } from './select-employee-by-condition-field';

const schema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  assignee: string().required('Hãy chọn nhân viên'),
  status: string().required('Hãy chọn status')
});

export type ForwardIssueFormProps = BusinessFormProps & {
  issueId: string;
  title: string;
  status: string;
  condition?: string;
};

export const ForwardIssueForm: FC<ForwardIssueFormProps> = props => {
  const forwardIssue = api.issue.forward.useMutation({
    onSuccess: async () => {
      success('Chuyển tiếp thành công');
      props.onSuccess?.();
    },
    onError: () => {
      error('Chuyển tiếp thất bại');
    }
  });

  return (
    <Form
      className={'mt-2 flex flex-col gap-4'}
      schema={schema}
      onSubmit={values => {
        forwardIssue.mutate({
          id: props.issueId,
          ...values
        });
      }}
      onCancel={props.onCancel}
      loading={forwardIssue.isPending}
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
