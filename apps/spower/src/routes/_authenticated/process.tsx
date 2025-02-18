import { createFileRoute } from '@tanstack/react-router';

import { FlowEditor, ProcessData } from '../../components/flow';
import processData from '../../components/flow/process.json';

export const Route = createFileRoute('/_authenticated/process')({
  component: RouteComponent,
  beforeLoad: () => ({ title: 'Quy trình' })
});

function RouteComponent() {
  return (
    <div className="h-full p-2">
      <FlowEditor
        value={processData.price as ProcessData}
        onChange={value => {
          console.log('value', value);
        }}
      />
    </div>
  );
}
