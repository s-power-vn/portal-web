import { requestApi } from 'portal-api';
import { date, object, string } from 'yup';

import { FC } from 'react';

import {
  BusinessFormProps,
  DatePickerField,
  Form,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

const schema = object().shape({
  title: string().required('Hãy nhập nội dung'),
  code: string().required('Hãy nhập số phiếu'),
  startDate: date().required('Hãy chọn ngày bắt đầu'),
  endDate: date()
    .required('Hãy chọn ngày kết thúc')
    .test({
      name: 'checkEndDate',
      message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      test: function () {
        const startDate = this.parent.startDate;
        const endDate = this.parent.endDate;
        if (startDate && endDate) {
          return startDate.getTime() < endDate.getTime();
        }
        return true;
      }
    })
});

export type EditRequestFormProps = BusinessFormProps & {
  issueId: string;
};

export const EditRequestForm: FC<EditRequestFormProps> = props => {
  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: props.issueId
  });

  const updateRequest = requestApi.updateInfo.useMutation({
    onSuccess: async () => {
      success('Cập nhật yêu cầu mua hàng thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      defaultValues={{
        code: request.data.code,
        title: request.data.expand.issue.title,
        startDate: new Date(Date.parse(request.data.expand.issue.startDate)),
        endDate: new Date(Date.parse(request.data.expand.issue.endDate))
      }}
      className={'flex flex-col gap-4'}
      loading={updateRequest.isPending}
      onSubmit={values => {
        return updateRequest.mutate({
          ...values,
          id: request.data.id
        });
      }}
      onCancel={props.onCancel}
    >
      <TextareaField
        schema={schema}
        name={'title'}
        title={'Nội dung công việc'}
      />
      <div className={'flex items-center gap-2'}>
        <TextField
          schema={schema}
          name={'code'}
          className={'flex-1'}
          title={'Số phiếu'}
          options={{
            maxLength: 20
          }}
        />
        <DatePickerField
          schema={schema}
          name={'startDate'}
          title={'Ngày bắt đầu'}
          className={'flex-1'}
          options={{
            showTime: true
          }}
        />
        <span className={'pt-4'}>-</span>
        <DatePickerField
          schema={schema}
          name={'endDate'}
          title={'Ngày kết thúc'}
          className={'flex-1'}
          options={{
            showTime: true
          }}
        />
      </div>
    </Form>
  );
};
