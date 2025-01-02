import { Show, cn } from '@minhdtb/storeo-core';

import { FC, memo } from 'react';
import { Handle, Position } from 'reactflow';

import { CustomNodeProps } from './node-a1';

const NodeA5: FC<CustomNodeProps> = ({ data, isConnectable }) => {
  const condition =
    data.status === 'A4F' || data.status === 'A5R' || data.status === 'A6R';

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
        <span>T.Phòng kế hoạch</span>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="t1"
        style={{ left: '40%' }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="s1"
        style={{ left: '60%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="s2"
        style={{ left: '40%' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="t2"
        style={{ left: '60%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="t3"
        style={{ top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="s3"
        style={{ top: '70%' }}
      />
    </>
  );
};

export default memo(NodeA5);
