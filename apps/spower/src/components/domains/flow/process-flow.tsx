import {
  Edge,
  MarkerType,
  ReactFlow,
  Node as XYFlowNode,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';

import { CustomNode } from './custom-node';
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

export const getNode = (
  processData: ProcessData,
  nodeId?: string
): Node | undefined => {
  if (!nodeId || !processData?.nodes?.length) {
    return undefined;
  }
  return processData.nodes.find((it: Node) => it.id === nodeId);
};

export const getNodeFromFlows = (processData: ProcessData, nodeId?: string) => {
  if (!nodeId || !processData?.flows?.length) {
    return [];
  }
  return processData.flows.filter((it: Flow) => it.from.node === nodeId);
};

export const isDoneNode = (processData: ProcessData, nodeId?: string) => {
  if (!nodeId || !processData?.nodes?.length) return false;
  const node = getNode(processData, nodeId);
  return node?.done || false;
};

export const getDoneFlows = (processData: ProcessData) => {
  if (!processData?.nodes?.length || !processData?.flows?.length) {
    return [];
  }
  const doneNodes = processData.nodes.filter((node: Node) => node.done);
  return processData.flows.filter((flow: Flow) =>
    doneNodes.some((node: Node) => flow.to.node === node.id)
  );
};

export const isApproveNode = (
  processData: ProcessData,
  nodeId?: string
): boolean => {
  if (!nodeId || !processData?.flows?.length) {
    return false;
  }

  const approvedFlows = processData.flows.filter((it: Flow) => it.approve);
  const fromNodeFlow = approvedFlows.find(
    (it: Flow) => it.from.node === nodeId
  );
  return fromNodeFlow ? true : false;
};

function getNodes(
  processData: ProcessData,
  status?: string,
  sourcePoint: { nodeId: string; pointId: string } | null = null,
  selectedNode: string | null = null,
  clickedNode: string | null = null
): XYFlowNode[] {
  if (!processData?.nodes?.length) {
    return [];
  }

  const extract = extractStatus(status);

  return processData.nodes.map((node: Node) => {
    const { id, x, y, points, done, ...rest } = node;

    const mappedPoints = points.map((point: Point) => ({
      ...point,
      id: `${id}#${point.id}`
    }));

    const pointsWithRoles = mappedPoints.map(
      (point: Point & { id: string }) => {
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
          ...point,
          role
        };
      }
    );

    const isApprove = isApproveNode(processData, id);

    return {
      id,
      type: 'customNode',
      data: {
        ...rest,
        nodeId: id,
        isApprove,
        done,
        points: pointsWithRoles,
        active: extract?.to ? id === extract.to : id === extract?.from,
        selected: id === selectedNode,
        clicked: id === clickedNode,
        sourcePoint,
        onPointClick: () => {} // This will be replaced in the component
      },
      position: { x, y }
    };
  });
}

function getEdges(processData: ProcessData, status?: string): Edge[] {
  if (!processData?.flows?.length) {
    return [];
  }

  const extract = extractStatus(status);

  return processData.flows.map((flow: Flow) => {
    const { id, from, to, approve, type } = flow;
    const fromNodeId = from.node;
    const toNodeId = to.node;

    const isActive = extract?.from === fromNodeId && extract?.to === toNodeId;

    // Map FlowType to edge type
    const edgeType = type || 'smoothstep';

    return {
      id,
      source: fromNodeId,
      target: toNodeId,
      sourceHandle: `${fromNodeId}#${from.point}`,
      targetHandle: `${toNodeId}#${to.point}`,
      type: edgeType,
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
  processData?: ProcessData;
  onPointClick?: (pointId: string, nodeId: string) => void;
};

export const ProcessFlow: FC<ProcessFlowProps> = ({
  status,
  processData = { nodes: [], flows: [] },
  onPointClick
}) => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<XYFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [sourcePoint, setSourcePoint] = useState<{
    nodeId: string;
    pointId: string;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);

  const fitViewOptions = useMemo(
    () => ({
      duration: 200,
      padding: 0.2,
      maxZoom: 1
    }),
    []
  );

  const handlePointClick = useCallback(
    (pointId: string, nodeId: string) => {
      setSourcePoint({ nodeId, pointId });
      setSelectedNode(nodeId);
      if (onPointClick) {
        onPointClick(pointId, nodeId);
      }
    },
    [onPointClick]
  );

  const onLayout = useCallback(async () => {
    setEdges(getEdges(processData, status));
    await nextTick(10);

    const updatedNodes = getNodes(
      processData,
      status,
      sourcePoint,
      selectedNode,
      clickedNode
    );

    // Update the onPointClick handler for each node
    const nodesWithHandlers = updatedNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onPointClick: handlePointClick
      }
    }));

    setNodes(nodesWithHandlers);

    // Only fit view if there are nodes to display
    if (nodesWithHandlers.length > 0) {
      fitView(fitViewOptions);
    }
  }, [
    fitView,
    fitViewOptions,
    setEdges,
    setNodes,
    status,
    processData,
    sourcePoint,
    selectedNode,
    clickedNode,
    handlePointClick
  ]);

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
      fitViewOptions={fitViewOptions}
    />
  );
};
