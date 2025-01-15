import type { FC } from 'react';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';

import { Show, cn } from '@minhdtb/storeo-core';

export type CustomNodeProps = {
  data: {
    status?: string;
  };
  isConnectable?: boolean;
};

const NodeA1: FC<CustomNodeProps> = ({ data, isConnectable }) => {
  const condition = data.status === 'A1' || data.status === 'A1R';

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
        <span>Người tạo công việc</span>
      </div>
      <Handle
        type="source"
        position={Position.Top}
        id="s1"
        style={{ left: '40%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        id="t1"
        position={Position.Top}
        style={{ left: '60%' }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(NodeA1);
