import type { RequestData } from 'portal-api';
import { api } from 'portal-api';
import type { RequestStatusOptions } from 'portal-core';
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

export type SendRequestFormProps = BusinessFormProps & {
  request: RequestData | null;
  status: RequestStatusOptions;
  title: string;
  condition?: string;
};

export const SendRequestForm: FC<SendRequestFormProps> = props => {
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
      defaultValues={{
        status: props.status
      }}
      onSubmit={values => {
        if (props.request) {
          updateRequest.mutate({
            ...values,
            id: props.request?.id
          });
        }
      }}
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
