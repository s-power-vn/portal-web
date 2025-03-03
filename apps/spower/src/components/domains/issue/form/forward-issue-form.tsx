import { api } from 'portal-api';
import { array, object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextareaField, error, success } from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../../hooks';
import { SelectEmployeeByConditionField } from '../../employee';

const schema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  assignees: array().of(string()).min(1, 'Hãy chọn ít nhất một nhân viên'),
  status: string().required('Hãy chọn status')
});

export type ForwardIssueFormProps = BusinessFormProps & {
  issueId: string;
  title: string;
  status: string;
  condition?: string;
};

export const ForwardIssueForm: FC<ForwardIssueFormProps> = props => {
  const invalidates = useInvalidateQueries();

  const createIssueAssign = api.issueAssign.create.useMutation({
    onSuccess: () => {
      invalidates([
        api.issue.byId.getKey(props.issueId),
        api.issue.listMine.getKey()
      ]);
    },
    onError: () => {
      error('Không thể tạo nhiệm vụ cho nhân viên phụ');
    }
  });

  const forwardIssue = api.issue.forward.useMutation({
    onSuccess: async result => {
      // Create issue assignments for each selected assignee
      if (result) {
        try {
          const primaryAssigneeId = result.assignee;

          // The form values will be available in the onSuccess callback
          const formElement = document.querySelector('form') as HTMLFormElement;
          const formData = new FormData(formElement);
          const assigneesStr = formData.get('assignees') as string;
          const assignees = assigneesStr ? assigneesStr.split(',') : [];

          // Create issue assignments for secondary assignees (excluding the primary one)
          for (const assigneeId of assignees) {
            if (assigneeId && assigneeId !== primaryAssigneeId) {
              await createIssueAssign.mutateAsync({
                issueId: props.issueId,
                assignId: assigneeId
              });
            }
          }

          success('Chuyển tiếp thành công');
          props.onSuccess?.();
        } catch (e) {
          console.error('Error creating issue assignments:', e);
          error('Đã có lỗi khi tạo nhiệm vụ cho nhân viên phụ');
        }
      }
    },
    onError: () => {
      error('Chuyển tiếp thất bại');
    }
  });

  return (
    <Form
      className={'mt-2 flex flex-col gap-4'}
      schema={schema}
      onSuccess={values => {
        // Get the first assignee as the primary one
        const assignees = values.assignees as string[];
        const primaryAssignee = assignees[0];

        forwardIssue.mutate({
          id: props.issueId,
          assignee: primaryAssignee,
          status: values.status,
          note: values.note
        });
      }}
      defaultValues={{
        status: props.status
      }}
      onCancel={props.onCancel}
      loading={forwardIssue.isPending}
    >
      <SelectEmployeeByConditionField
        schema={schema}
        name="assignees"
        title={props.title}
        options={{
          className: 'w-full',
          condition: props.condition,
          multiple: true
        }}
      />
      <TextareaField schema={schema} name={'note'} title={'Ghi chú'} />
    </Form>
  );
};
