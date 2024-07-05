import { FC, memo } from 'react';
import { Handle, Position } from 'reactflow';

type CustomNodeProps = {
  isConnectable?: boolean;
};

const NodeA1: FC<CustomNodeProps> = ({ isConnectable }) => {
  return (
    <>
      <Handle
        type="source"
        position={Position.Top}
        id="s1"
        style={{ left: 10 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        id="t1"
        position={Position.Top}
        style={{ right: 10, left: 'auto' }}
        isConnectable={isConnectable}
      />
      <div className={'rounded bg-red-500 px-4 py-2 text-xs'}>
        Người tạo công việc
      </div>
    </>
  );
};

export default memo(NodeA1);
