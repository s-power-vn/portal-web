import { Loader2 } from 'lucide-react';
import { api } from 'portal-api';
import { array, object, string } from 'yup';

import { type FC, useMemo } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextareaField, error, success } from '@minhdtb/storeo-theme';

import { SelectEmployeeByConditionField } from '../../employee';
import { Node } from '../../flow';

const singleSchema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  status: string().required('Hãy chọn status')
});

export type SingleForwardIssueFormProps = BusinessFormProps & {
  issueId: string;
  status: string;
  employeeId: string;
};

export const SingleForwardIssueForm: FC<SingleForwardIssueFormProps> = ({
  issueId,
  employeeId,
  status,
  onSuccess,
  onCancel
}) => {
  const forwardIssue = api.issue.forward.useMutation({
    onSuccess: () => {
      success('Chuyển tiếp thành công');
      onSuccess?.();
    },
    onError: () => {
      error('Chuyển tiếp thất bại');
    }
  });

  return (
    <Form
      className={'flex flex-col gap-3'}
      schema={singleSchema}
      onSuccess={values => {
        forwardIssue.mutate({
          id: issueId,
          assignees: [employeeId],
          status: values.status,
          note: values.note
        });
      }}
      defaultValues={{
        status
      }}
      onCancel={onCancel}
      loading={forwardIssue.isPending}
    >
      <TextareaField schema={singleSchema} name={'note'} title={'Ghi chú'} />
    </Form>
  );
};

const multipleSchema = object().shape({
  note: string().required('Hãy nhập ghi chú'),
  assignees: array()
    .of(string().required('Hãy chọn ít nhất một nhân viên'))
    .required('Hãy chọn ít nhất một nhân viên'),
  status: string().required('Hãy chọn status')
});

export type MultipleForwardIssueFormProps = BusinessFormProps & {
  issueId: string;
  status: string;
  condition?: string;
};

export const MultipleForwardIssueForm: FC<MultipleForwardIssueFormProps> = ({
  issueId,
  status,
  condition,
  onSuccess,
  onCancel
}) => {
  const forwardIssue = api.issue.forward.useMutation({
    onSuccess: () => {
      success('Chuyển tiếp thành công');
      onSuccess?.();
    },
    onError: () => {
      error('Chuyển tiếp thất bại');
    }
  });

  return (
    <Form
      className={'flex flex-col gap-3'}
      schema={multipleSchema}
      onSuccess={values => {
        forwardIssue.mutate({
          id: issueId,
          assignees: values.assignees ?? [],
          status: values.status,
          note: values.note
        });
      }}
      defaultValues={{
        status
      }}
      onCancel={onCancel}
      loading={forwardIssue.isPending}
    >
      <SelectEmployeeByConditionField
        schema={multipleSchema}
        name={'assignees'}
        title={'Nhân viên'}
        options={{
          className: 'w-full',
          multiple: true,
          condition
        }}
      />
      <TextareaField schema={multipleSchema} name={'note'} title={'Ghi chú'} />
    </Form>
  );
};

export type ForwardIssueFormProps = BusinessFormProps & {
  issueId: string;
  status: string;
  node?: Node;
};

export const ForwardIssueForm: FC<ForwardIssueFormProps> = ({
  issueId,
  status,
  node,
  onSuccess,
  onCancel
}) => {
  const isAutoForward = node?.type === 'auto';
  const isApprovalNode = node?.type === 'approval';

  const { data: approvers, isLoading: isLoadingApprovers } =
    api.employee.byIds.useQuery({
      variables: node?.approvers ?? [],
      enabled: isApprovalNode
    });

  const { data: employees, isLoading: isLoadingEmployees } =
    api.employee.listFull.useQuery({
      variables: {
        filter: node?.condition
      }
    });

  const singleEmployee = useMemo(() => {
    if (isApprovalNode) {
      return approvers && approvers.length === 1 ? approvers?.[0] : undefined;
    }

    return employees && employees.length === 1 ? employees[0] : undefined;
  }, [isApprovalNode, approvers, employees]);

  return isLoadingApprovers || isLoadingEmployees ? (
    <div className={'flex items-center justify-center'}>
      <Loader2 className={'h-4 w-4 animate-spin'} />
    </div>
  ) : singleEmployee ? (
    <SingleForwardIssueForm
      issueId={issueId}
      status={status}
      employeeId={singleEmployee.id}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  ) : (
    <MultipleForwardIssueForm
      issueId={issueId}
      status={status}
      condition={node?.condition}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};
