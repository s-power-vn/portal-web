import { createFileRoute } from '@tanstack/react-router';

import { FlowEditor } from '../../components/flow';
import { ProcessData } from '../../components/flow/flow-editor';
import processData from '../../components/flow/process.json';

export const Route = createFileRoute('/_authenticated/process')({
  component: RouteComponent,
  beforeLoad: () => ({ title: 'Quy trình' })
});

function RouteComponent() {
  return (
    <div className="h-full">
      <FlowEditor data={{ request: processData.price as ProcessData }} />
    </div>
  );
}
