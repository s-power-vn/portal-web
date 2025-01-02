import { RequestData, requestApi } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';
import { object, string } from 'yup';

import { FC } from 'react';

import {
  BusinessFormProps,
  Form,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

const schema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  status: string().required('Hãy chọn status')
});

export type ReturnRequestFormProps = BusinessFormProps & {
  request: RequestData;
  status: RequestStatusOptions;
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
        status: props.status
      }}
      onSubmit={values =>
        returnRequest.mutate({
          ...values,
          id: props.request.id,
          issue: props.request.issue
        })
      }
      onCancel={props.onCancel}
      loading={returnRequest.isPending}
    >
      <TextareaField schema={schema} name={'note'} title={'Ghi chú'} />
    </Form>
  );
};
