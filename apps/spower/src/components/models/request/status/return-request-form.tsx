import { object, string } from 'yup';

import { FC } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { Button, Form, TextareaField, success } from '@storeo/theme';

import { RequestData, requestApi } from '../../../../api';

const schema = object().shape({
  note: string(),
  lastAssignee: string().required('Hãy chọn nhân viên'),
  status: string().required('Hãy chọn status')
});

export type ReturnRequestFormProps = {
  request: RequestData;
  status: RequestStatusOptions;
  onSuccess?: () => void;
};

export const ReturnRequestForm: FC<ReturnRequestFormProps> = props => {
  const returnRequest = requestApi.return.useMutation({
    onSuccess: async () => {
      success('Cập nhật thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      className={'mt-2 flex flex-col gap-4'}
      schema={schema}
      defaultValues={{
        status: props.status,
        lastAssignee: props.request.expand.issue.lastAssignee
      }}
      onSubmit={values =>
        returnRequest.mutate({
          ...values,
          id: props.request.id,
          issue: props.request.issue
        })
      }
      loading={returnRequest.isPending}
    >
      <TextareaField schema={schema} name={'note'} title={'Phản hồi'} />
      <div className={'mt-6 flex justify-end'}>
        <Button type="submit">Chấp nhận</Button>
      </div>
    </Form>
  );
};
