import { FC, memo } from 'react';
import { Handle, Position } from 'reactflow';

import { Show, cn } from '@storeo/core';

import { CustomNodeProps } from './node-a1';

const NodeA3: FC<CustomNodeProps> = ({ data, isConnectable }) => {
  const condition = data.status === 'A2F' || data.status === 'A3R';

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
        <span>T.Phòng kỹ thuật</span>
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
        type="source"
        position={Position.Right}
        id="s3"
        style={{ top: '50%' }}
      />
    </>
  );
};

export default memo(NodeA3);
