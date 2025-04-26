import { issueApi } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextareaField, error, success } from '@minhdtb/storeo-theme';

const schema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  status: string().required('Hãy chọn status')
});

export type FinishIssueFormProps = BusinessFormProps & {
  issueId: string;
  status: string;
};

export const FinishIssueForm: FC<FinishIssueFormProps> = props => {
  const finishIssue = issueApi.finish.useMutation({
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
      className={'flex flex-col gap-3'}
      schema={schema}
      defaultValues={{
        status: props.status
      }}
      onSuccess={values => {
        finishIssue.mutate({
          id: props.issueId,
          ...values
        });
      }}
      onCancel={props.onCancel}
      loading={finishIssue.isPending}
    >
      <TextareaField schema={schema} name={'note'} title={'Ghi chú'} />
    </Form>
  );
};
