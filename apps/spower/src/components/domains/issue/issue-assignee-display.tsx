import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import { FC, Suspense } from 'react';

import { MultipleEmployeeDisplay } from '../employee';

export type IssueAssigneeDisplayProps = {
  issueId: string;
  maxVisible?: number;
};

const IssueAssigneeComponent: FC<IssueAssigneeDisplayProps> = ({
  issueId,
  maxVisible = 2
}) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  // Use assignees directly from the issue record
  const assignees = issue.data.assignees || [];

  return (
    <MultipleEmployeeDisplay assigneeIds={assignees} maxVisible={maxVisible} />
  );
};

export const IssueAssigneeDisplay: FC<IssueAssigneeDisplayProps> = props => {
  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      <IssueAssigneeComponent {...props} />
    </Suspense>
  );
};
