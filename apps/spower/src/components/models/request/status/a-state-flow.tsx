import { FC, useEffect } from 'react';
import {
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesInitialized,
  useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';

import NodeA1 from '../../../flow/node-a1';
import NodeA2 from '../../../flow/node-a2';
import NodeA3 from '../../../flow/node-a3';
import NodeA4 from '../../../flow/node-a4';

const initialNodes = [
  {
    id: 'A1',
    type: 'nodeA1',
    data: {},
    position: { x: 100, y: 125 }
  },
  {
    id: 'A2',
    type: 'nodeA2',
    data: {},
    position: { x: 400, y: 0 }
  },
  {
    id: 'A3',
    type: 'nodeA3',
    data: {},
    position: { x: 300, y: 125 }
  },
  {
    id: 'A4',
    type: 'nodeA4',
    data: {},
    position: { x: 300, y: 200 }
  }
];

const initialEdges = [
  {
    id: 'A1-A2',
    source: 'A1',
    target: 'A2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A2-A1',
    source: 'A2',
    target: 'A1',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A2-A3',
    source: 'A2',
    target: 'A3',
    type: 'smoothstep',
    sourceHandle: 's2',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A3-A2',
    source: 'A3',
    target: 'A2',
    type: 'smoothstep',
    targetHandle: 't2',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  }
];

const nodeTypes = {
  nodeA1: NodeA1,
  nodeA2: NodeA2,
  nodeA3: NodeA3,
  nodeA4: NodeA4
};

export type AStateFlowProps = {};

export const AStateFlow: FC<AStateFlowProps> = () => {
  const nodesInitialized = useNodesInitialized();
  const [nodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    if (nodesInitialized) {
      setEdges(initialEdges);
    }
  }, [nodesInitialized, setEdges]);

  return (
    <div className={'h-[400px] w-[500px]'}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
      ></ReactFlow>
    </div>
  );
};
