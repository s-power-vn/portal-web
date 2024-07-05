import { FC, memo } from 'react';
import { Handle, Position } from 'reactflow';

type CustomNodeProps = {
  isConnectable?: boolean;
};

const NodeA4: FC<CustomNodeProps> = ({ isConnectable }) => {
  return (
    <>
      <Handle
        type="source"
        position={Position.Top}
        style={{ left: 80, background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ left: 60, background: '#555' }}
      />
      <span className={'rounded bg-blue-400 px-4 py-2 text-xs'}>
        NV.Phòng kế hoạch
      </span>
    </>
  );
};

export default memo(NodeA4);
