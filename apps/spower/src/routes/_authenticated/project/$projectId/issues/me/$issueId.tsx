import { createFileRoute } from '@tanstack/react-router';
import { Loader } from 'lucide-react';

import { Suspense } from 'react';

import { Issue } from '../../../../../../components';

const Component = () => {
  const { issueId } = Route.useParams();

  return (
    <Suspense
      fallback={
        <div className={`p-2`}>
          <Loader className={'h-6 w-6 animate-spin'} />
        </div>
      }
    >
      <Issue issueId={issueId} />
    </Suspense>
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/me/$issueId'
)({
  component: Component
});
