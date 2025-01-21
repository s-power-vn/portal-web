import _ from 'lodash';

import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import {
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from 'reactflow';

import { Show, cn } from '@minhdtb/storeo-core';

import processData from '../../process.json';

export const nextTick = async (frames = 1) => {
  const _nextTick = async (idx: number) => {
    return new Promise(resolve => {
      requestAnimationFrame(() => resolve(idx));
    });
  };
  for (let i = 0; i < frames; i++) {
    await _nextTick(i);
  }
};

export const extractStatus = (status?: string) => {
  if (!status) {
    return null;
  }

  const [node, index] = status.split('#');
  const [from, to] = node.split('-');

  return {
    from,
    to,
    index: Number(index)
  };
};

const CustomNode = ({
  data
}: {
  data: {
    name: string;
    description: string;
    active: boolean;
    sources: {
      id: string;
      type: 'top' | 'bottom' | 'right' | 'left';
    }[];
    targets: {
      id: string;
      type: 'top' | 'bottom' | 'right' | 'left';
    }[];
  };
}) => {
  const points = [...data.sources, ...data.targets];
  const leftPoints = _.sortBy(
    points.filter(point => point.type === 'left'),
    'id'
  );
  const topPoints = _.sortBy(
    points.filter(point => point.type === 'top'),
    'id'
  );
  const rightPoints = _.sortBy(
    points.filter(point => point.type === 'right'),
    'id'
  );
  const bottomPoints = _.sortBy(
    points.filter(point => point.type === 'bottom'),
    'id'
  );

  return (
    <>
      <div
        className={cn(
          `flex w-40 items-center justify-center gap-2 rounded border p-2 text-xs`,
          data.active ? 'border-appError' : ''
        )}
      >
        <Show when={data.active}>
          <div className={'bg-appError h-3 w-3 rounded-full'}></div>
        </Show>
        <span>{data.name}</span>
      </div>
      {leftPoints.reverse().map((point, index) => (
        <Handle
          key={point.id}
          type={data.sources.includes(point) ? 'source' : 'target'}
          position={Position.Left}
          id={point.id}
          style={{ top: `${(index + 1) * (100 / (leftPoints.length + 1))}%` }}
        />
      ))}
      {topPoints.map((point, index) => (
        <Handle
          key={point.id}
          type={data.sources.includes(point) ? 'source' : 'target'}
          position={Position.Top}
          id={point.id}
          style={{ left: `${(index + 1) * (100 / (topPoints.length + 1))}%` }}
        />
      ))}
      {rightPoints.map((point, index) => (
        <Handle
          key={point.id}
          type={data.sources.includes(point) ? 'source' : 'target'}
          position={Position.Right}
          id={point.id}
          style={{ top: `${(index + 1) * (100 / (rightPoints.length + 1))}%` }}
        />
      ))}
      {bottomPoints.reverse().map((point, index) => (
        <Handle
          key={point.id}
          type={data.sources.includes(point) ? 'source' : 'target'}
          position={Position.Bottom}
          id={point.id}
          style={{
            left: `${(index + 1) * (100 / (bottomPoints.length + 1))}%`
          }}
        />
      ))}
    </>
  );
};

function getNodes(status?: string) {
  return processData.request.nodes.map(node => {
    const { id, x, y, ...rest } = node;

    const sources = node.points
      .map(point => {
        return {
          ...point,
          id: `${id}#${point.id}`
        };
      })
      .filter(point => {
        return processData.request.flows.some(
          flow => `${flow.from.node}#${flow.from.point}` === point.id
        );
      });

    const targets = node.points
      .map(point => {
        return {
          ...point,
          id: `${id}#${point.id}`
        };
      })
      .filter(point => {
        return processData.request.flows.some(
          flow => `${flow.to.node}#${flow.to.point}` === point.id
        );
      });

    const extract = extractStatus(status);

    return {
      id: id,
      type: 'customNode',
      data: {
        ...rest,
        sources,
        targets,
        active: extract?.to ? id === extract?.to : id === extract?.from
      },
      position: {
        x,
        y
      }
    };
  });
}

function getEdges(status?: string) {
  return processData.request.flows.map(flow => {
    return {
      id: flow.id,
      source: `${flow.from.node}`,
      target: `${flow.to.node}`,
      sourceHandle: `${flow.from.node}#${flow.from.point}`,
      targetHandle: `${flow.to.node}#${flow.to.point}`,
      type: flow.type ? flow.type : 'smoothstep',
      style: status === flow.id ? { stroke: '#CC313D' } : {},
      markerEnd:
        status === flow.id
          ? {
              type: MarkerType.ArrowClosed,
              color: '#CC313D',
              width: 20,
              height: 20
            }
          : {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20
            }
    };
  });
}

const nodeTypes = { customNode: CustomNode };

export type ProcessFlowProps = {
  status?: string;
};

export const ProcessFlow: FC<ProcessFlowProps> = ({ status }) => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onLayout = useCallback(async () => {
    setEdges(getEdges(status));
    await nextTick(10);
    setNodes(getNodes(status));
    fitView();
  }, [fitView, setEdges, setNodes, status]);

  useEffect(() => {
    onLayout();
  }, [onLayout]);

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodesDraggable={false}
      fitView
    />
  );
};
