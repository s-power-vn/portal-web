import { FC, useMemo, useState } from 'react';

import { SelectInput, SelectInputProps, success } from '@storeo/theme';

import { employeeApi } from '../../../api';
import { issueApi } from '../../../api/issue';

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
  const employees = employeeApi.listFull.useQuery();
  const data = useMemo(
    () =>
      (employees.data ?? []).map(it => ({
        value: it.id,
        label: it.name,
        group: it.expand.department.name
      })),
    [employees.data]
  );

  const changeAssignee = issueApi.changeAssignee.useMutation({
    onSuccess: () => {
      success('Thay đổi người thực hiện thành công');
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
        changeAssignee.mutate({
          issueId,
          assigneeId: value
        });
      }}
      {...props}
    />
  );
};
