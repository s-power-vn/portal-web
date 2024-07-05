import { FC, memo } from 'react';
import { Handle, Position } from 'reactflow';

type CustomNodeProps = {
  isConnectable?: boolean;
};

const NodeA2: FC<CustomNodeProps> = ({ isConnectable }) => {
  return (
    <>
      <div className={'rounded bg-green-500 px-4 py-2 text-xs'}>
        Phó giám đốc
      </div>
      <Handle
        type="target"
        id={'t1'}
        position={Position.Left}
        style={{ top: 5 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Left}
        id={'s1'}
        style={{ bottom: 0, top: 'auto' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="s2"
        style={{ left: 20, background: '#555', position: 'absolute' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        id="t2"
        position={Position.Bottom}
        style={{ left: 40, background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(NodeA2);
