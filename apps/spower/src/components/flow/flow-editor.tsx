import _ from 'lodash';
import { CheckCircle2Icon } from 'lucide-react';
import * as yup from 'yup';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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

import { NodeProperty } from './node-property';
import { PropertySidebar } from './property-sidebar';
import type { Node, PointRole, ProcessData } from './types';

type CustomNodeProps = {
  data: {
    nodeId: string;
    name: string;
    description: string;
    active: boolean;
    isApprove: boolean;
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
};

const CustomNode: FC<CustomNodeProps> = ({ data }) => {
  const points = useMemo(
    () => [...data.sources, ...data.targets],
    [data.sources, data.targets]
  );

  const { leftPoints, topPoints, rightPoints, bottomPoints } = useMemo(() => {
    const sortByPointId = (points: typeof data.sources) => {
      return _.sortBy(points, point => {
        const match = point.id.match(/p(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    };

    return {
      leftPoints: sortByPointId(points.filter(point => point.type === 'left')),
      topPoints: sortByPointId(points.filter(point => point.type === 'top')),
      rightPoints: sortByPointId(
        points.filter(point => point.type === 'right')
      ),
      bottomPoints: sortByPointId(
        points.filter(point => point.type === 'bottom')
      )
    };
  }, [points]);

  return (
    <>
      <div
        className={cn(
          'flex w-40 items-center justify-center gap-2 rounded border p-2 text-xs',
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

function getNodes(data: ProcessData) {
  return data.nodes.map(node => {
    const { id, x, y, points, ...rest } = node;

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

    const isApprove = data.flows.some(
      flow => flow.from.node === id && flow.approve
    );

    return {
      id,
      type: 'customNode',
      data: {
        ...rest,
        nodeId: id,
        isApprove,
        sources,
        targets,
        active: false
      },
      position: { x, y },
      draggable: true
    };
  });
}

function getEdges(data: ProcessData) {
  return data.flows.map(flow => {
    return {
      id: flow.id,
      source: `${flow.from.node}`,
      target: `${flow.to.node}`,
      sourceHandle: `${flow.from.node}#${flow.from.point}`,
      targetHandle: `${flow.to.node}#${flow.to.point}`,
      type: flow.type ? flow.type : 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20
      }
    };
  });
}

const nodeTypes = { customNode: CustomNode };

export type FlowEditorProps = {
  data: {
    request: ProcessData;
  };
  onChange?: (data: { request: ProcessData }) => void;
};

type NodeFormValues = {
  name: string;
  description: string;
  condition: string;
};

const schema = yup
  .object({
    name: yup.string().required('Tên node là bắt buộc'),
    description: yup.string().default(''),
    condition: yup.string().default('')
  })
  .required();

export const FlowEditor: FC<FlowEditorProps> = ({ data, onChange }) => {
  const { fitView } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowData, setFlowData] = useState(data);
  const [showSidebar, setShowSidebar] = useState(true);

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const fitViewOptions = useMemo(
    () => ({
      duration: 200,
      padding: 0.2
    }),
    []
  );

  const handleFitView = useCallback(() => {
    requestAnimationFrame(() => {
      fitView(fitViewOptions);
    });
  }, [fitView, fitViewOptions]);

  const nodesById = useMemo(
    () =>
      Object.fromEntries(flowData.request.nodes.map(node => [node.id, node])),
    [flowData.request.nodes]
  );

  const handleNodeClick = useCallback(
    (_: any, node: { id: string }) => {
      const foundNode = nodesById[node.id];
      if (foundNode) {
        setSelectedNode(foundNode);
        setShowSidebar(true);
        setTimeout(() => {
          handleFitView();
        }, 100);
      }
    },
    [nodesById, handleFitView]
  );

  const handleCloseSidebar = useCallback(() => {
    setShowSidebar(false);
    setSelectedNode(null);
    setTimeout(() => {
      handleFitView();
    }, 100);
  }, [handleFitView]);

  const updateFlowData = useCallback(
    (updatedData: typeof flowData) => {
      if (!_.isEqual(flowData, updatedData)) {
        setFlowData(updatedData);
        onChange?.(updatedData);
      }
    },
    [flowData, onChange]
  );

  const handleNodesChange = useCallback(
    (changes: any[]) => {
      onNodesChangeInternal(changes);

      const updatedNodes = flowData.request.nodes.map(node => {
        const updatedNode = nodes.find(n => n.id === node.id);
        if (updatedNode) {
          return {
            ...node,
            x: updatedNode.position.x,
            y: updatedNode.position.y
          };
        }
        return node;
      });

      const updatedData = {
        request: {
          ...flowData.request,
          nodes: updatedNodes
        }
      };

      updateFlowData(updatedData);
    },
    [flowData.request, nodes, onNodesChangeInternal, updateFlowData]
  );

  const onLayout = useCallback(() => {
    const newEdges = getEdges(flowData.request);
    const newNodes = getNodes(flowData.request);

    setEdges(newEdges);
    setNodes(newNodes);
  }, [flowData.request, setEdges, setNodes]);

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<Node>) => {
      const updatedNodes = flowData.request.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      );

      const updatedData = {
        request: {
          ...flowData.request,
          nodes: updatedNodes
        }
      };

      updateFlowData(updatedData);
      onLayout();
    },
    [flowData.request, updateFlowData, onLayout]
  );

  useEffect(() => {
    onLayout();
    handleFitView();
  }, [onLayout, handleFitView, showSidebar]);

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ReactFlow
          nodeTypes={memoizedNodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={fitViewOptions}
        />
      </div>
      {showSidebar && (
        <PropertySidebar title="Thuộc tính node" onClose={handleCloseSidebar}>
          <NodeProperty
            selectedNode={selectedNode}
            onNodeUpdate={handleNodeUpdate}
          />
        </PropertySidebar>
      )}
    </div>
  );
};
