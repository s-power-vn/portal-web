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
      onSubmit={values =>
        createRequest.mutate({
          ...values,
          projectId: props.projectId
        })
      }
    >
      <TextareaField
        schema={CreateRequestSchema}
        name={'name'}
        title={'Nội dung'}
      />
      <div className={'flex gap-2'}>
        <DatePickerField
          schema={CreateRequestSchema}
          name={'startDate'}
          title={'Ngày bắt đầu'}
          className={'w-full'}
          options={{
            showTime: true
          }}
        />
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
