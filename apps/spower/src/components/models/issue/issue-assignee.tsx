import { FC, useMemo } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

import { useGetAllEmployees } from '../../../api';

export type IssueAssigneeProps = Omit<SelectInputProps, 'items'> & {
  issueId: string;
};

export const IssueAssignee: FC<IssueAssigneeProps> = ({
  issueId,
  ...props
}) => {
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

  return (
    <SelectInput
      items={data}
      placeholder={'Chọn nhân viên'}
      showGroups={true}
      showSearch={true}
      {...props}
    />
  );
};
