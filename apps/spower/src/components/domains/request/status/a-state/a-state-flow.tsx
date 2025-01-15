import type { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useEffect } from 'react';
import { MarkerType, ReactFlow, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

import NodeA1 from '../../../../flow/node-a1';
import NodeA2 from '../../../../flow/node-a2';
import NodeA3 from '../../../../flow/node-a3';
import NodeA4 from '../../../../flow/node-a4';
import NodeA5 from '../../../../flow/node-a5';
import NodeA6 from '../../../../flow/node-a6';

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
  },
  {
    id: 'A5',
    type: 'nodeA5',
    data: {},
    position: { x: 500, y: 125 }
  },
  {
    id: 'A6',
    type: 'nodeA6',
    data: {},
    position: { x: 500, y: 200 }
  }
];

const initialEdges = [
  {
    id: 'A1F',
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
    id: 'A1R',
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
    id: 'A2F',
    source: 'A2',
    target: 'A3',
    sourceHandle: 's2',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A2R',
    source: 'A3',
    target: 'A2',
    targetHandle: 't2',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A3F',
    source: 'A3',
    target: 'A4',
    sourceHandle: 's2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A3R',
    source: 'A4',
    target: 'A3',
    targetHandle: 't2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A6R',
    source: 'A2',
    target: 'A5',
    sourceHandle: 's3',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A6F',
    source: 'A5',
    target: 'A2',
    targetHandle: 't3',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A5F',
    source: 'A5',
    target: 'A6',
    sourceHandle: 's2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A5R',
    source: 'A6',
    target: 'A5',
    targetHandle: 't2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A4F',
    source: 'A3',
    target: 'A5',
    sourceHandle: 's3',
    targetHandle: 't3',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  },
  {
    id: 'A4R',
    source: 'A5',
    target: 'A3',
    sourceHandle: 's3',
    targetHandle: 't3',
    type: 'smoothstep',
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
  nodeA4: NodeA4,
  nodeA5: NodeA5,
  nodeA6: NodeA6
};

export type AStateFlowProps = {
  status?: RequestStatusOptions;
};

export const AStateFlow: FC<AStateFlowProps> = ({ status }) => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  useEffect(() => {
    if (status) {
      setEdges(edges => {
        return edges.map(edge => {
          if (edge.id === status) {
            return {
              ...edge,
              style: {
                stroke: '#CC313D',
                strokeWidth: 2
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#CC313D'
              }
            };
          }
          return edge;
        });
      });

      setNodes(nodes => {
        return nodes.map(node => {
          return {
            ...node,
            data: {
              status
            }
          };
        });
      });
    }
  }, [setEdges, setNodes, status]);

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      fitView
      nodesDraggable={false}
    ></ReactFlow>
  );
};
