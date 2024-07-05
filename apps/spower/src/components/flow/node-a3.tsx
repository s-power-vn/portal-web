import { FC, memo } from 'react';
import { Handle, Position } from 'reactflow';

type CustomNodeProps = {
  isConnectable?: boolean;
};

const NodeA3: FC<CustomNodeProps> = ({ isConnectable }) => {
  return (
    <>
      <span className={'rounded bg-blue-500 px-4 py-2 text-xs'}>
        T.Phòng kế hoạch
      </span>
      <Handle
        type="source"
        position={Position.Top}
        id="s1"
        style={{ left: 80, background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="t1"
        style={{ left: 60, background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="s2"
        style={{ left: 80, background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="t2"
        style={{ left: 60, background: '#555' }}
      />
    </>
  );
};

export default memo(NodeA3);
