import { useQueryClient } from '@tanstack/react-query';
import { date, object, string } from 'yup';

import { FC } from 'react';

import {
  Button,
  DatePickerField,
  DialogFooter,
  Form,
  TextareaField,
  success
} from '@storeo/theme';

import { issueApi } from '../../../api/issue';

const schema = object().shape({
  title: string().required('Hãy nhập nội dung'),
  startDate: date().required('Hãy chọn ngày bắt đầu'),
  endDate: date()
    .required('Hãy chọn ngày kết thúc')
    .test({
      name: 'checkEndDate',
      message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      test: function (value) {
        const startDate = this.parent.startDate;
        const endDate = this.parent.endDate;
        if (startDate && endDate) {
          return startDate.getTime() < endDate.getTime();
        }
        return true;
      }
    })
});

export type EditIssueFormProps = {
  issueId: string;
  onSuccess?: () => void;
};

export const EditIssueForm: FC<EditIssueFormProps> = props => {
  const queryClient = useQueryClient();

  const issue = issueApi.byId.useSuspenseQuery({
    variables: props.issueId
  });

  const updateIssue = issueApi.update.useMutation({
    onSuccess: async () => {
      success('Cập nhật công việc thành công');
      props.onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueApi.byId.getKey(props.issueId)
        })
      ]);
    }
  });

  return (
    <Form
      schema={schema}
      defaultValues={{
        ...issue.data,
        startDate: new Date(Date.parse(issue.data.startDate)),
        endDate: new Date(Date.parse(issue.data.endDate))
      }}
      className={'mt-2 flex flex-col gap-4'}
      loading={updateIssue.isPending}
      onSubmit={values => {
        return updateIssue.mutate({
          ...values,
          issueId: props.issueId,
          project: issue.data.project
        });
      }}
    >
      <TextareaField
        schema={schema}
        name={'title'}
        title={'Nội dung công việc'}
      />
      <div className={'flex items-center gap-2'}>
        <DatePickerField
          schema={schema}
          name={'startDate'}
          title={'Ngày bắt đầu'}
          className={'w-full'}
          options={{
            showTime: true
          }}
        />
        <span className={'px-2 pt-4'}>-</span>
        <DatePickerField
          schema={schema}
          name={'endDate'}
          title={'Ngày kết thúc'}
          className={'w-full'}
          options={{
            showTime: true
          }}
        />
      </div>
      <DialogFooter className={'mt-4'}>
        <Button type="submit">Chấp nhận</Button>
      </DialogFooter>
    </Form>
  );
};
