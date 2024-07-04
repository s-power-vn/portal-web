import { object, string } from 'yup';

import { FC } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { Button, Form, TextareaField, success } from '@storeo/theme';

import { RequestData, requestApi } from '../../../../api';
import { SelectEmployeeByConditionField } from './select-employee-by-condition-field';

const schema = object().shape({
  note: string(),
  assignee: string().required('Hãy chọn nhân viên'),
  status: string().required('Hãy chọn status')
});

export type SendRequestFormProps = {
  request: RequestData;
  status: RequestStatusOptions;
  title: string;
  onSuccess?: () => void;
};

export const SendRequestForm: FC<SendRequestFormProps> = props => {
  const updateRequest = requestApi.update.useMutation({
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
        updateRequest.mutate({
          ...values,
          id: props.request.id,
          issue: props.request.issue
        })
      }
      loading={updateRequest.isPending}
    >
      <SelectEmployeeByConditionField
        schema={schema}
        name={'assignee'}
        title={props.title}
        options={{
          className: 'w-full',
          condition: 'role = 2'
        }}
      />
      <TextareaField schema={schema} name={'note'} title={'Ghi chú'} />
      <div className={'mt-6 flex justify-end'}>
        <Button type="submit">Chấp nhận</Button>
      </div>
    </Form>
  );
};
