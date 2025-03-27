import {
  Edge,
  FitViewOptions,
  MarkerType,
  ReactFlow,
  Node as XYFlowNode,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  processData?: ProcessData,
  nodeId?: string
): Node | undefined => {
  return processData?.nodes?.find((it: Node) => it.id === nodeId);
};

export const getNodeFromFlows = (processData: ProcessData, nodeId?: string) => {
  if (!nodeId || !processData?.flows?.length) {
    return [];
  }
  return processData.flows.filter((it: Flow) => it.from.node === nodeId);
};

export const isFinishedNode = (processData: ProcessData, nodeId?: string) => {
  if (!nodeId || !processData?.nodes?.length) return false;
  const node = getNode(processData, nodeId);
  return node?.type === 'finish' || false;
};

export const getFinishedFlows = (processData: ProcessData) => {
  if (!processData?.nodes?.length || !processData?.flows?.length) {
    return [];
  }
  const finishedNodes = processData.nodes.filter(
    (node: Node) => node.type === 'finish'
  );
  return processData.flows.filter((flow: Flow) =>
    finishedNodes.some((node: Node) => flow.to.node === node.id)
  );
};

export const isApproveNode = (
  processData: ProcessData,
  nodeId?: string
): boolean => {
  if (!nodeId || !processData?.flows?.length) {
    return false;
  }

  const node = getNode(processData, nodeId);

  return node?.type === 'approval' || false;
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
    const { id, x, y, points, type, ...rest } = node;

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
        type,
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

  return processData.flows.map((flow: Flow) => {
    const { id, from, to, type } = flow;
    const fromNodeId = from.node;
    const toNodeId = to.node;

    // Directly compare flow id with status
    const isActiveFlow = id === status;

    // Map FlowType to edge type
    const edgeType = type || 'smoothstep';

    // Set the style directly instead of using className
    const edgeStyle = {
      strokeWidth: isActiveFlow ? 2 : 1,
      stroke: isActiveFlow ? '#CC313D' : '#b1b1b7'
    };

    return {
      id,
      source: fromNodeId,
      target: toNodeId,
      sourceHandle: `${fromNodeId}#${from.point}`,
      targetHandle: `${toNodeId}#${to.point}`,
      type: edgeType,
      style: edgeStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: isActiveFlow ? 15 : 20,
        height: isActiveFlow ? 15 : 20,
        color: isActiveFlow ? '#CC313D' : '#b1b1b7'
      }
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

  const fitViewOptions: FitViewOptions = useMemo(
    () => ({
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
      selectedNode
    );

    const nodesWithHandlers = updatedNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isView: true,
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
      nodesConnectable={false}
      draggable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      fitView
      fitViewOptions={fitViewOptions}
    />
  );
};
