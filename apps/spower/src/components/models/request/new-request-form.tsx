import { DateTime } from 'luxon';

import { FC } from 'react';

import {
  Button,
  DatePickerField,
  DialogFooter,
  Form,
  TextareaField,
  success
} from '@storeo/theme';

import { CreateRequestSchema, requestApi } from '../../../api';
import { RequestDetailListField } from '../request-detail/request-detail-list-field';

export type NewRequestFormProps = {
  projectId: string;
  onSuccess?: () => void;
};

export const NewRequestForm: FC<NewRequestFormProps> = props => {
  const createRequest = requestApi.create.useMutation({
    onSuccess: async () => {
      success('Tạo yêu cầu mua hàng thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={CreateRequestSchema}
      defaultValues={{
        name: '',
        startDate: DateTime.now()
      }}
      className={'mt-2 flex flex-col gap-4'}
      loading={createRequest.isPending}
      onSubmit={values => {
        console.log(values);
        return createRequest.mutate({
          ...values,
          startDate: (values.startDate as DateTime)?.toJSDate(),
          endDate: (values.endDate as DateTime)?.toJSDate(),
          projectId: props.projectId
        });
      }}
    >
      <TextareaField
        schema={CreateRequestSchema}
        name={'name'}
        title={'Nội dung công việc'}
      />
      <div className={'flex items-center gap-2'}>
        <DatePickerField
          schema={CreateRequestSchema}
          name={'startDate'}
          title={'Ngày bắt đầu'}
          className={'w-full'}
          options={{
            showTime: true
          }}
        />
        <span className={'px-2 pt-4'}>-</span>
        <DatePickerField
          schema={CreateRequestSchema}
          name={'endDate'}
          title={'Ngày kết thúc'}
          className={'w-full'}
          options={{
            showTime: true
          }}
        />
      </div>
      <RequestDetailListField
        schema={CreateRequestSchema}
        name={'details'}
        options={{ projectId: props.projectId }}
      />
      <DialogFooter className={'mt-4'}>
        <Button type="submit">Chấp nhận</Button>
      </DialogFooter>
    </Form>
  );
};
