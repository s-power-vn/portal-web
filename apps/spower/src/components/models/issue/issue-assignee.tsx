import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FC, useMemo, useState } from 'react';

import { client } from '@storeo/core';
import { SelectInput, SelectInputProps } from '@storeo/theme';

import { useGetAllEmployees } from '../../../api';
import { getAllIssuesKey, getMyIssuesKey } from '../../../api/issue';

export type IssueAssigneeProps = Omit<
  SelectInputProps,
  'items' | 'onChange'
> & {
  projectId: string;
  issueId: string;
};

export const IssueAssignee: FC<IssueAssigneeProps> = ({
  projectId,
  issueId,
  ...props
}) => {
  const [value, setValue] = useState(props.value);
  const employees = useGetAllEmployees();
  const data = useMemo(
    () =>
      (employees.data ?? []).map(it => ({
        value: it.id,
        label: it.name,
        group: it.expand.department.name
      })),
    [employees.data]
  );

  const queryClient = useQueryClient();
  const updateIssueAssignee = useMutation({
    mutationKey: ['updateIssueAssignee', issueId],
    mutationFn: (id?: string) =>
      client.collection('issue').update(issueId, {
        assignee: id
      }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: getMyIssuesKey(projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: getAllIssuesKey(projectId)
        })
      ]);
    }
  });

  return (
    <SelectInput
      items={data}
      value={value}
      placeholder={'Chọn nhân viên'}
      showGroups={true}
      showSearch={true}
      onChange={value => {
        setValue(value);
        updateIssueAssignee.mutate(value);
      }}
      {...props}
    />
  );
};
