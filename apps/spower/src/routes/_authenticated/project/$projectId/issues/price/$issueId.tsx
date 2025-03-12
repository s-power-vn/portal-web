import { createFileRoute } from '@tanstack/react-router';
import { Loader } from 'lucide-react';

import { Suspense } from 'react';

import { Issue } from '../../../../../../components';

const Component = () => {
  const { issueId } = Route.useParams();

  return (
    <div className={'p-2'}>
      <Suspense
        fallback={
          <div className={`p-2`}>
            <Loader className={'h-6 w-6 animate-spin'} />
          </div>
        }
      >
        <Issue issueId={issueId} />
      </Suspense>
    </div>
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/price/$issueId'
)({
  component: Component
});
