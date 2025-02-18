import { createFileRoute } from '@tanstack/react-router';

import { FlowEditor, ProcessData } from '../../../components';
import processData from '../../../components/flow/process.json';

export const Route = createFileRoute('/_authenticated/settings/process')({
  component: RouteComponent,
  beforeLoad: () => ({ title: 'Quản lý quy trình' })
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
