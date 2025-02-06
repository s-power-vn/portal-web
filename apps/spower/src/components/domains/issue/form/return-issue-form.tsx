import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextareaField, error, success } from '@minhdtb/storeo-theme';

const schema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  status: string().required('Hãy chọn status')
});

export type ReturnIssueFormProps = BusinessFormProps & {
  issueId: string;
  status: string;
};

export const ReturnIssueForm: FC<ReturnIssueFormProps> = props => {
  const returnIssue = api.issue.return.useMutation({
    onSuccess: async () => {
      success('Cập nhật thành công');
      props.onSuccess?.();
    },
    onError: () => {
      error('Cập nhật thất bại');
    }
  });

  return (
    <Form
      className={'mt-2 flex flex-col gap-4'}
      schema={schema}
      defaultValues={{
        status: props.status
      }}
      onSubmit={values => {
        returnIssue.mutate({
          id: props.issueId,
          ...values
        });
      }}
      onCancel={props.onCancel}
      loading={returnIssue.isPending}
    >
      <TextareaField schema={schema} name={'note'} title={'Ghi chú'} />
    </Form>
  );
};
