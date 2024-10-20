import { useQueryClient } from '@tanstack/react-query';
import { object, string } from 'yup';

import { FC } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { BusinessFormProps, Form, TextareaField, success } from '@storeo/theme';

import { RequestData, requestApi } from '../../../../api';
import { SelectEmployeeByConditionField } from './select-employee-by-condition-field';

const schema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  assignee: string().required('Hãy chọn nhân viên'),
  status: string().required('Hãy chọn status')
});

export type SendRequestFormProps = BusinessFormProps & {
  request: RequestData;
  status: RequestStatusOptions;
  title: string;
  condition?: string;
};

export const SendRequestForm: FC<SendRequestFormProps> = props => {
  const queryClient = useQueryClient();

  const updateRequest = requestApi.updateStatus.useMutation({
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
        updateRequest.mutate({
          ...values,
          id: props.request.id
        })
      }
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
