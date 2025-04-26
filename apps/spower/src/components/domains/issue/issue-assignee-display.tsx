import { Loader } from 'lucide-react';
import { issueApi } from 'portal-api';

import { FC, Suspense } from 'react';

import { MultipleEmployeeDisplay } from '../employee';

export type IssueAssigneeDisplayProps = {
  issueId: string;
  maxVisible?: number;
};

const IssueAssigneeComponent: FC<IssueAssigneeDisplayProps> = ({
  issueId,
  maxVisible = 1
}) => {
  const issue = issueApi.byId.useSuspenseQuery({
    variables: issueId
  });

  const assignees = issue.data.assignees || [];

  return (
    <MultipleEmployeeDisplay
      assigneeIds={assignees.map(a => a.id)}
      maxVisible={maxVisible}
    />
  );
};

export const IssueAssigneeDisplay: FC<IssueAssigneeDisplayProps> = props => {
  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      <IssueAssigneeComponent {...props} />
    </Suspense>
  );
};
