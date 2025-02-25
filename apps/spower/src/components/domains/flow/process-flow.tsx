import {
  Edge,
  Handle,
  MarkerType,
  Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';
import _ from 'lodash';
import { CheckCircle2Icon } from 'lucide-react';

import type { FC } from 'react';
import { useCallback, useEffect } from 'react';

import { Show, cn } from '@minhdtb/storeo-core';

import processData from './process.json';

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

export const getNode = (type: 'request' | 'price', nodeId?: string) => {
  return processData[type].nodes.find(it => it.id === nodeId);
};

export const getNodeFromFlows = (
  type: 'request' | 'price',
  nodeId?: string
) => {
  return processData[type].flows.filter(it => it.from.node === nodeId);
};

export const isDoneNode = (type: 'request' | 'price', nodeId?: string) => {
  if (!nodeId) return false;
  const node = getNode(type, nodeId);
  return node?.done || false;
};

export const getDoneFlows = (type: 'request' | 'price') => {
  const doneNodes = processData[type].nodes.filter(node => node.done);
  return processData[type].flows.filter(flow =>
    doneNodes.some(node => flow.to.node === node.id)
  );
};

export const isApproveNode = (
  type: 'request' | 'price',
  nodeId?: string
): boolean => {
  if (!nodeId) {
    return false;
  }

  const approvedFlows = processData[type].flows.filter(it => it.approve);
  const fromNodeFlow = approvedFlows.find(it => it.from.node === nodeId);
  return fromNodeFlow ? true : false;
};

type PointRole = 'source' | 'target' | 'unknown';

const CustomNode = ({
  data
}: {
  data: {
    nodeId: string;
    type: 'request' | 'price';
    name: string;
    description: string;
    active: boolean;
    isApprove: boolean;
    done: boolean;
    sources: {
      id: string;
      type: 'top' | 'bottom' | 'right' | 'left';
      role: PointRole;
    }[];
    targets: {
      id: string;
      type: 'top' | 'bottom' | 'right' | 'left';
      role: PointRole;
    }[];
  };
}) => {
  const points = [...data.sources, ...data.targets];

  const sortByPointId = (points: typeof data.sources) => {
    return _.sortBy(points, point => {
      const match = point.id.match(/p(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
  };

  const leftPoints = sortByPointId(
    points.filter(point => point.type === 'left')
  );
  const topPoints = sortByPointId(points.filter(point => point.type === 'top'));
  const rightPoints = sortByPointId(
    points.filter(point => point.type === 'right')
  );
  const bottomPoints = sortByPointId(
    points.filter(point => point.type === 'bottom')
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
        <Show when={data.isApprove}>
          <CheckCircle2Icon className="h-4 w-4 text-blue-500" />
        </Show>
        <Show when={data.done}>
          <div className={'bg-appSuccess h-3 w-3 rounded-full'}></div>
        </Show>
      </div>
      {leftPoints.reverse().map((point, index) => (
        <Handle
          key={point.id}
          type={data.sources.includes(point) ? 'source' : 'target'}
          position={Position.Left}
          id={point.id}
          className={cn(point.role === 'unknown' && 'hidden')}
          style={{ top: `${(index + 1) * (100 / (leftPoints.length + 1))}%` }}
        />
      ))}
      {topPoints.map((point, index) => (
        <Handle
          key={point.id}
          type={data.sources.includes(point) ? 'source' : 'target'}
          position={Position.Top}
          id={point.id}
          className={cn(point.role === 'unknown' && 'hidden')}
          style={{ left: `${(index + 1) * (100 / (topPoints.length + 1))}%` }}
        />
      ))}
      {rightPoints.map((point, index) => (
        <Handle
          key={point.id}
          type={data.sources.includes(point) ? 'source' : 'target'}
          position={Position.Right}
          id={point.id}
          className={cn(point.role === 'unknown' && 'hidden')}
          style={{ top: `${(index + 1) * (100 / (rightPoints.length + 1))}%` }}
        />
      ))}
      {bottomPoints.reverse().map((point, index) => (
        <Handle
          key={point.id}
          type={data.sources.includes(point) ? 'source' : 'target'}
          position={Position.Bottom}
          id={point.id}
          className={cn(point.role === 'unknown' && 'hidden')}
          style={{
            left: `${(index + 1) * (100 / (bottomPoints.length + 1))}%`
          }}
        />
      ))}
    </>
  );
};

function getNodes(type: 'request' | 'price', status?: string) {
  const data = processData[type];
  const extract = extractStatus(status);

  return data.nodes.map(node => {
    const { id, x, y, points, done, ...rest } = node;

    const mappedPoints = points.map(point => ({
      ...point,
      id: `${id}#${point.id}`
    }));

    const pointsWithRoles = mappedPoints.map(point => {
      const isSource = data.flows.some(
        flow => `${flow.from.node}#${flow.from.point}` === point.id
      );
      const isTarget = data.flows.some(
        flow => `${flow.to.node}#${flow.to.point}` === point.id
      );

      let role: PointRole = 'unknown';
      if (isSource) role = 'source';
      if (isTarget) role = 'target';

      return {
        point: { ...point, role },
        isSource,
        isTarget
      };
    });

    const sources = pointsWithRoles
      .filter(({ isSource, isTarget }) => isSource || (!isSource && !isTarget))
      .map(({ point }) => point);

    const targets = pointsWithRoles
      .filter(({ isTarget }) => isTarget)
      .map(({ point }) => point);

    const isApprove = isApproveNode(type, id);

    return {
      id,
      type: 'customNode',
      data: {
        ...rest,
        nodeId: id,
        type,
        isApprove,
        done,
        sources,
        targets,
        active: extract?.to ? id === extract.to : id === extract?.from
      },
      position: { x, y }
    };
  });
}

function getEdges(type: 'request' | 'price', status?: string) {
  return processData[type].flows.map(flow => {
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
  type: 'request' | 'price';
  status?: string;
};

export const ProcessFlow: FC<ProcessFlowProps> = ({ type, status }) => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onLayout = useCallback(async () => {
    setEdges(getEdges(type, status));
    await nextTick(10);
    setNodes(getNodes(type, status));
    fitView();
  }, [fitView, setEdges, setNodes, status, type]);

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
