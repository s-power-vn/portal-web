import { FC, useState } from 'react';

import { SelectInputProps, success } from '@storeo/theme';

import { issueApi } from '../../../api/issue';
import { SelectEmployee } from '../employee/select-employee';

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

  const changeAssignee = issueApi.changeAssignee.useMutation({
    onSuccess: () => {
      success('Thay đổi người thực hiện thành công');
    }
  });

  return (
    <SelectEmployee
      value={value}
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
