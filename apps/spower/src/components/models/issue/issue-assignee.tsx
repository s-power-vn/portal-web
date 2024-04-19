import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FC, useMemo, useState } from 'react';

import { client } from '@storeo/core';
import { SelectInput, SelectInputProps } from '@storeo/theme';

import { ProjectSearch, useGetAllEmployees } from '../../../api';

export type IssueAssigneeProps = Omit<
  SelectInputProps,
  'items' | 'onChange'
> & {
  projectId: string;
  issueId: string;
  search?: ProjectSearch;
};

export const IssueAssignee: FC<IssueAssigneeProps> = ({
  projectId,
  issueId,
  search,
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
    mutationFn: async (id?: string) => {
      const issue = await client.collection('issue').getOne(issueId);
      const lastAssignee = issue.assignee;
      return await client.collection('issue').update(issueId, {
        assignee: id,
        lastAssignee
      });
    },
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getMyIssuesKey']
        }),
        queryClient.invalidateQueries({
          queryKey: ['getAllIssuesKey']
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
