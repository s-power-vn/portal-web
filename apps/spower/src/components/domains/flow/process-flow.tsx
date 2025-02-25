import {
  Edge,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  Node as XYFlowNode,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';
import _ from 'lodash';
import { CheckCircle2Icon } from 'lucide-react';

import type { FC } from 'react';
import { useCallback, useEffect } from 'react';

import { Show, cn } from '@minhdtb/storeo-core';

import type { Flow, Node, Point, PointRole, ProcessData } from './types';

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

export const getNode = (processData: ProcessData, nodeId?: string) => {
  return processData.nodes.find((it: Node) => it.id === nodeId);
};

export const getNodeFromFlows = (processData: ProcessData, nodeId?: string) => {
  return processData.flows.filter((it: Flow) => it.from.node === nodeId);
};

export const isDoneNode = (processData: ProcessData, nodeId?: string) => {
  if (!nodeId) return false;
  const node = getNode(processData, nodeId);
  return node?.done || false;
};

export const getDoneFlows = (processData: ProcessData) => {
  const doneNodes = processData.nodes.filter((node: Node) => node.done);
  return processData.flows.filter((flow: Flow) =>
    doneNodes.some((node: Node) => flow.to.node === node.id)
  );
};

export const isApproveNode = (
  processData: ProcessData,
  nodeId?: string
): boolean => {
  if (!nodeId) {
    return false;
  }

  const approvedFlows = processData.flows.filter((it: Flow) => it.approve);
  const fromNodeFlow = approvedFlows.find(
    (it: Flow) => it.from.node === nodeId
  );
  return fromNodeFlow ? true : false;
};

const CustomNode = ({
  data
}: {
  data: {
    nodeId: string;
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

function getNodes(processData: ProcessData, status?: string) {
  const extract = extractStatus(status);

  return processData.nodes.map((node: Node) => {
    const { id, x, y, points, done, ...rest } = node;

    const mappedPoints = points.map((point: Point) => ({
      ...point,
      id: `${id}#${point.id}`
    }));

    const pointsWithRoles = mappedPoints.map((point: Point) => {
      const isSource = processData.flows.some(
        (flow: Flow) => `${flow.from.node}#${flow.from.point}` === point.id
      );
      const isTarget = processData.flows.some(
        (flow: Flow) => `${flow.to.node}#${flow.to.point}` === point.id
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

    const isApprove = isApproveNode(processData, id);

    return {
      id,
      type: 'customNode',
      data: {
        ...rest,
        nodeId: id,
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

function getEdges(processData: ProcessData, status?: string) {
  const extract = extractStatus(status);

  return processData.flows.map((flow: Flow) => {
    const { id, from, to, approve } = flow;
    const fromNodeId = from.node;
    const toNodeId = to.node;

    const fromNode = getNode(processData, fromNodeId);
    const toNode = getNode(processData, toNodeId);

    const isActive = extract?.from === fromNodeId && extract?.to === toNodeId;

    return {
      id,
      source: fromNodeId,
      target: toNodeId,
      sourceHandle: `${fromNodeId}#${from.point}`,
      targetHandle: `${toNodeId}#${to.point}`,
      type: 'default',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20
      },
      className: cn(
        'stroke-2',
        approve ? 'stroke-blue-500' : '',
        isActive ? 'stroke-appError' : ''
      )
    };
  });
}

const nodeTypes = { customNode: CustomNode };

export type ProcessFlowProps = {
  status?: string;
  processData: ProcessData;
};

export const ProcessFlow: FC<ProcessFlowProps> = ({ status, processData }) => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<XYFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onLayout = useCallback(async () => {
    setEdges(getEdges(processData, status));
    await nextTick(10);
    setNodes(getNodes(processData, status));
    fitView();
  }, [fitView, setEdges, setNodes, status, processData]);

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
