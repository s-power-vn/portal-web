import { useQueryClient } from '@tanstack/react-query';
import { object, string } from 'yup';

import { FC } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { BusinessFormProps, Form, TextareaField, success } from '@storeo/theme';

import { RequestData, requestApi } from '../../../../api';

const schema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  status: string().required('Hãy chọn status')
});

export type ReturnRequestFormProps = BusinessFormProps & {
  request: RequestData;
  status: RequestStatusOptions;
};

export const ReturnRequestForm: FC<ReturnRequestFormProps> = props => {
  const queryClient = useQueryClient();
  const returnRequest = requestApi.return.useMutation({
    onSuccess: async () => {
      success('Cập nhật thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.userInfo.getKey()
        })
      ]);
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
