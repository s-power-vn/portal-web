import { createFileRoute } from '@tanstack/react-router';

import { Suspense } from 'react';

import { IssueDetail } from '../../../../../../components';

const Component = () => {
  const { issueId } = Route.useParams();

  return (
    <Suspense fallback={'Đang tải...'}>
      <IssueDetail issueId={issueId} />
    </Suspense>
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/all/$issueId'
)({
  component: Component
});
