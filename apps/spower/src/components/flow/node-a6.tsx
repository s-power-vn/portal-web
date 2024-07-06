import { FC, memo } from 'react';
import { Handle, Position } from 'reactflow';

import { Show, cn } from '@storeo/core';

import { CustomNodeProps } from './node-a1';

const NodeA6: FC<CustomNodeProps> = ({ data, isConnectable }) => {
  const condition = data.status === 'A5F';

  return (
    <>
      <div
        className={cn(
          `flex w-40 items-center justify-center gap-2 rounded border p-2 text-xs`,
          condition ? 'border-appError' : ''
        )}
      >
        <Show when={condition}>
          <div className={'bg-appError h-3 w-3 rounded-full'}></div>
        </Show>
        <span>NV.Phòng kế hoạch</span>
      </div>
      <Handle type="target" position={Position.Top} style={{ left: '40%' }} />
      <Handle type="source" position={Position.Top} style={{ left: '60%' }} />
    </>
  );
};

export default memo(NodeA6);
