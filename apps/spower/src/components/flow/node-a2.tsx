import { Show, cn } from '@minhdtb/storeo-core';

import { FC, memo } from 'react';
import { Handle, Position } from 'reactflow';

import { CustomNodeProps } from './node-a1';

const NodeA2: FC<CustomNodeProps> = ({ data, isConnectable }) => {
  const condition =
    data.status === 'A1F' ||
    data.status === 'A2R' ||
    data.status === 'A6F' ||
    data.status === 'A7';

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
        <span>Phó giám đốc</span>
      </div>
      <Handle
        type="target"
        id={'t1'}
        position={Position.Left}
        style={{ top: '30%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Left}
        id={'s1'}
        style={{ top: '70%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="s2"
        style={{ left: '20%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        id="t2"
        position={Position.Bottom}
        style={{ left: '40%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="s3"
        style={{ left: '60%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        id="t3"
        position={Position.Bottom}
        style={{ left: '80%' }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(NodeA2);
