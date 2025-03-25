import { uuidv7 } from '@kripod/uuidv7';
import {
  Background,
  Controls,
  MarkerType,
  NodeTypes,
  ReactFlow,
  Edge as XYFlowEdge,
  Node as XYFlowNode,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react';
import _ from 'lodash';
import {
  CheckIcon,
  GripVertical,
  PlayIcon,
  PlusCircleIcon,
  ZapIcon
} from 'lucide-react';
import { setTimeout } from 'timers';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Show, cn } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

import { CustomNode } from './custom-node';
import { FlowProperty } from './flow-property';
import { NodeProperty } from './node-property';
import { PropertySidebar } from './property-sidebar';
import type {
  Flow,
  Node,
  NodeType,
  Point,
  PointRole,
  ProcessData
} from './types';

function getNodes(
  data: ProcessData,
  selectedNode: Node | null,
  sourcePoint: { nodeId: string; pointId: string } | null
) {
  return data.nodes.map(node => {
    const { id, x, y, points, condition, ...rest } = node;

    // Map all points and initialize their roles based on flows
    const mappedPoints = points.map(point => {
      const pointId = `${id}#${point.id}`;
      const isSource = data.flows.some(
        flow => `${flow.from.node}#${flow.from.point}` === pointId
      );
      const isTarget = data.flows.some(
        flow => `${flow.to.node}#${flow.to.point}` === pointId
      );

      let role: PointRole = 'unknown';
      if (isSource) role = 'source';
      if (isTarget) role = 'target';

      return {
        ...point,
        id: pointId,
        role
      };
    });

    const isApprove = data.flows.some(
      flow => flow.from.node === id && flow.approver && flow.approver.length > 0
    );

    return {
      id,
      type: 'customNode',
      data: {
        ...rest,
        nodeId: id,
        isApprove,
        condition: !!condition,
        points: mappedPoints,
        active: false,
        selected: selectedNode?.id === id,
        clicked: sourcePoint?.nodeId === id,
        onPointClick: () => {},
        sourcePoint
      },
      position: { x, y },
      draggable: true
    };
  });
}

function getEdges(data: ProcessData, selectedFlow: Flow | null) {
  return data.flows.map(flow => {
    const isSelected = selectedFlow?.id === flow.id;
    return {
      id: flow.id,
      source: `${flow.from.node}`,
      target: `${flow.to.node}`,
      sourceHandle: `${flow.from.node}#${flow.from.point}`,
      targetHandle: `${flow.to.node}#${flow.to.point}`,
      type: flow.type ? flow.type : 'smoothstep',
      style: {
        strokeWidth: isSelected ? 2 : 1,
        stroke: isSelected ? '#CC313D' : '#9CA3AF'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: isSelected ? 13 : 20,
        height: isSelected ? 13 : 20,
        color: isSelected ? '#CC313D' : '#9CA3AF'
      }
    };
  });
}

const nodeTypes: NodeTypes = {
  customNode: CustomNode
};

export type FlowEditorProps = {
  value?: ProcessData;
  onChange?: (value: ProcessData) => void;
  objectType?: string;
};

export const FlowEditor: FC<FlowEditorProps> = ({
  value,
  onChange,
  objectType = ''
}) => {
  const reactFlowInstance = useReactFlow();
  const { fitView } = reactFlowInstance;
  const isReady = useRef(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [flowData, setFlowData] = useState<ProcessData>(
    () => value || { nodes: [], flows: [] }
  );
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const [nodes, setNodes, onNodesChange] = useNodesState<XYFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<XYFlowEdge>([]);

  const [sourcePoint, setSourcePoint] = useState<{
    nodeId: string;
    pointId: string;
  } | null>(null);

  const fitViewOptions = useMemo(
    () => ({
      duration: 200,
      padding: 0.2,
      maxZoom: 1
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
      Object.fromEntries((flowData?.nodes || []).map(node => [node.id, node])),
    [flowData?.nodes]
  );

  const flowsById = useMemo(
    () =>
      Object.fromEntries((flowData?.flows || []).map(flow => [flow.id, flow])),
    [flowData?.flows]
  );

  const handleNodeClick = useCallback(
    (_: any, node: { id: string }) => {
      const foundNode = nodesById[node.id];
      if (foundNode) {
        setSelectedNode(foundNode);
        setSelectedFlow(null);
        setShowSidebar(true);
      }
    },
    [nodesById, handleFitView]
  );

  const handleEdgeClick = useCallback(
    (_: any, edge: { id: string }) => {
      const foundFlow = flowsById[edge.id];
      if (foundFlow) {
        setSelectedFlow(foundFlow);
        setSelectedNode(null);
        setShowSidebar(true);
      }
    },
    [flowsById]
  );

  const handleCloseSidebar = useCallback(() => {
    setShowSidebar(false);
    setSelectedNode(null);
    setSelectedFlow(null);
    setTimeout(() => {
      handleFitView();
    }, 100);
  }, [handleFitView]);

  const updateFlowData = useCallback(
    (updatedData: ProcessData) => {
      if (!_.isEqual(flowData, updatedData)) {
        setFlowData(updatedData);
        onChange?.(updatedData);
      }
    },
    [flowData, onChange]
  );

  const onLayout = useCallback(async () => {
    if (!flowData) return;

    const newEdges = getEdges(flowData, selectedFlow);
    const newNodes = getNodes(flowData, selectedNode, sourcePoint).map(node => {
      const existingNode = nodes.find(n => n.id === node.id);
      const position = existingNode?.position || {
        x: node.position.x,
        y: node.position.y
      };

      return {
        ...node,
        position,
        data: {
          ...node.data,
          clicked: sourcePoint?.nodeId === node.id,
          onPointClick: (pointId: string, nodeId: string) => {
            if (!sourcePoint) {
              // Check if the clicked point is an input point - it cannot be a source
              const clickedPoint = node.data.points.find(
                p => p.id === pointId.split('#')[1]
              );
              if (clickedPoint?.autoType === 'input') {
                return;
              }
              setSourcePoint({ nodeId, pointId });
            } else {
              // Check if clicking the same point
              if (
                sourcePoint.nodeId === nodeId &&
                sourcePoint.pointId === pointId
              ) {
                setSourcePoint(null);
                return;
              }

              // Get source and target points
              const sourceNode = flowData.nodes.find(
                n => n.id === sourcePoint.nodeId
              );
              const targetNode = flowData.nodes.find(n => n.id === nodeId);

              if (!sourceNode || !targetNode) {
                setSourcePoint(null);
                return;
              }

              const sourcePointData = sourceNode.points.find(
                p => `${sourceNode.id}#${p.id}` === sourcePoint.pointId
              );
              const targetPointData = targetNode.points.find(
                p => `${targetNode.id}#${p.id}` === pointId
              );

              if (!sourcePointData || !targetPointData) {
                setSourcePoint(null);
                return;
              }

              // Prevent incorrect connections for auto nodes
              if (sourcePointData.autoType === 'input') {
                // Input points can only be targets, not sources
                setSourcePoint(null);
                return;
              }

              if (
                targetPointData.autoType === 'true' ||
                targetPointData.autoType === 'false'
              ) {
                // True/False points can only be sources, not targets
                setSourcePoint(null);
                return;
              }

              // Check if flow already exists
              const flowExists = flowData.flows.some(
                flow =>
                  (flow.from.node === sourcePoint.nodeId &&
                    flow.from.point === sourcePoint.pointId.split('#')[1] &&
                    flow.to.node === nodeId &&
                    flow.to.point === pointId.split('#')[1]) ||
                  (flow.from.node === nodeId &&
                    flow.from.point === pointId.split('#')[1] &&
                    flow.to.node === sourcePoint.nodeId &&
                    flow.to.point === sourcePoint.pointId.split('#')[1])
              );

              if (flowExists) {
                setSourcePoint(null);
                return;
              }

              // Generate flow ID
              const baseId = `${sourcePoint.nodeId}-${nodeId}`;
              const existingFlows = flowData.flows.filter(flow => {
                const flowBaseId = flow.id.split('#')[0];
                return flowBaseId === baseId;
              });
              const newFlowNumber = existingFlows.length + 1;
              const newFlowId = `${baseId}#${newFlowNumber}`;

              const newFlow: Flow = {
                id: newFlowId,
                from: {
                  node: sourcePoint.nodeId,
                  point: sourcePoint.pointId.split('#')[1]
                },
                to: {
                  node: nodeId,
                  point: pointId.split('#')[1]
                }
              };

              const updatedData: ProcessData = {
                ...flowData,
                nodes: flowData.nodes,
                flows: [...flowData.flows, newFlow]
              };

              updateFlowData(updatedData);
              setSourcePoint(null);
              onLayout();
            }
          }
        }
      };
    });

    // Batch update nodes and edges together
    requestAnimationFrame(() => {
      setEdges(newEdges);
      setNodes(newNodes);
    });
  }, [
    flowData,
    selectedFlow,
    selectedNode,
    setEdges,
    setNodes,
    sourcePoint,
    updateFlowData,
    handleFitView
  ]);

  const handleFlowUpdate = useCallback(
    (flowId: string, updates: Partial<Flow>) => {
      const updatedFlows = flowData.flows.map(flow =>
        flow.id === flowId ? { ...flow, ...updates } : flow
      );

      const updatedData: ProcessData = {
        ...flowData,
        nodes: flowData.nodes,
        flows: updatedFlows
      };

      updateFlowData(updatedData);
      onLayout();
    },
    [flowData, updateFlowData, onLayout]
  );

  const updateNodeInternals = useUpdateNodeInternals();

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<Node>) => {
      let updatedNodes = flowData.nodes.map(node => {
        if (node.id === nodeId) {
          // For start and finished nodes, limit to maximum 2 points
          if (
            (node.type === 'start' || node.type === 'finished') &&
            updates.points
          ) {
            // If more than 2 points, limit to 2
            if (updates.points.length > 2) {
              return {
                ...node,
                ...updates,
                points: updates.points.slice(0, 2)
              };
            }
            // Otherwise, allow the update
            return { ...node, ...updates };
          }
          return { ...node, ...updates };
        }
        return node;
      });

      let updatedFlows = flowData.flows;

      if (updates.points) {
        const node = updatedNodes.find(n => n.id === nodeId);
        if (node) {
          const currentPointIds = new Set(node.points.map(p => p.id));
          updatedFlows = flowData.flows.filter(flow => {
            const isSourcePoint = flow.from.node === nodeId;
            const isTargetPoint = flow.to.node === nodeId;

            if (isSourcePoint && !currentPointIds.has(flow.from.point)) {
              return false;
            }
            if (isTargetPoint && !currentPointIds.has(flow.to.point)) {
              return false;
            }
            return true;
          });
        }
      }

      const updatedData: ProcessData = {
        ...flowData,
        nodes: updatedNodes,
        flows: updatedFlows
      };

      updateFlowData(updatedData);
      onLayout();

      setTimeout(() => {
        requestAnimationFrame(() => {
          updateNodeInternals(nodeId);
        });
      }, 200);
    },
    [flowData, updateFlowData, onLayout, updateNodeInternals]
  );

  const handleFlowDelete = useCallback(
    async (flowId: string) => {
      const flowToDelete = flowData.flows.find(flow => flow.id === flowId);
      const updatedFlows = flowData.flows.filter(flow => flow.id !== flowId);

      // Reset roles for points involved in the deleted flow
      const updatedNodes = flowData.nodes.map(node => {
        if (
          flowToDelete &&
          (node.id === flowToDelete.from.node ||
            node.id === flowToDelete.to.node)
        ) {
          return {
            ...node,
            points: node.points.map(point => {
              const pointId = `${node.id}#${point.id}`;
              const isStillSource = updatedFlows.some(
                flow => `${flow.from.node}#${flow.from.point}` === pointId
              );
              const isStillTarget = updatedFlows.some(
                flow => `${flow.to.node}#${flow.to.point}` === pointId
              );

              let role: PointRole = 'unknown';
              if (isStillSource) role = 'source';
              if (isStillTarget) role = 'target';

              return {
                ...point,
                role
              };
            })
          };
        }
        return node;
      });

      const updatedData: ProcessData = {
        ...flowData,
        nodes: updatedNodes,
        flows: updatedFlows
      };

      updateFlowData(updatedData);
      setSelectedFlow(null);
      await onLayout();
    },
    [flowData, updateFlowData, onLayout]
  );

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      const updatedNodes = flowData.nodes.filter(node => node.id !== nodeId);
      const updatedFlows = flowData.flows.filter(
        flow => flow.from.node !== nodeId && flow.to.node !== nodeId
      );

      const updatedData = {
        ...flowData,
        nodes: updatedNodes,
        flows: updatedFlows
      };

      updateFlowData(updatedData);
      setSelectedNode(null);
      onLayout();
    },
    [flowData, updateFlowData, onLayout]
  );

  const onConnect = useCallback(
    (params: any) => {
      const sourceNode = flowData.nodes.find(node => node.id === params.source);
      const targetNode = flowData.nodes.find(node => node.id === params.target);

      if (!sourceNode || !targetNode) {
        return;
      }

      const sourcePoint = sourceNode.points.find(
        point => `${sourceNode.id}#${point.id}` === params.sourceHandle
      );
      const targetPoint = targetNode.points.find(
        point => `${targetNode.id}#${point.id}` === params.targetHandle
      );

      if (!sourcePoint || !targetPoint) {
        return;
      }

      // Prevent incorrect connections for auto nodes
      if (sourcePoint.autoType === 'input') {
        // Input points can only be targets, not sources
        return;
      }

      if (targetPoint.autoType === 'true' || targetPoint.autoType === 'false') {
        // True/False points can only be sources, not targets
        return;
      }

      // Tạo ID cơ bản cho flow
      const baseId = `${sourceNode.id}-${targetNode.id}`;

      // Tìm số thứ tự lớn nhất hiện tại cho flow giữa hai node này
      let maxFlowNumber = 0;
      flowData.flows.forEach(flow => {
        if (flow.id.startsWith(baseId)) {
          const parts = flow.id.split('#');
          if (parts.length === 2) {
            const flowNumber = parseInt(parts[1], 10);
            if (!isNaN(flowNumber) && flowNumber > maxFlowNumber) {
              maxFlowNumber = flowNumber;
            }
          }
        }
      });

      const uniqueId = uuidv7().replace(/-/g, '');
      const newFlowId = `${baseId}__${uniqueId}#${maxFlowNumber + 1}`;

      const newFlow: Flow = {
        id: newFlowId,
        from: {
          node: sourceNode.id,
          point: sourcePoint.id
        },
        to: {
          node: targetNode.id,
          point: targetPoint.id
        }
      };

      const updatedData: ProcessData = {
        ...flowData,
        flows: [...flowData.flows, newFlow]
      };

      updateFlowData(updatedData);
    },
    [flowData, updateFlowData]
  );

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.pageX;
    startWidthRef.current = sidebarWidth;
    setIsResizing(true);
  }, []);

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = startXRef.current - e.pageX;
      const newWidth = Math.min(
        Math.max(startWidthRef.current + diff, 200),
        500
      );
      setSidebarWidth(newWidth);
    },
    [isResizing]
  );

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    handleFitView();
  }, [handleFitView]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResizing);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, handleResize, stopResizing]);

  useEffect(() => {
    onLayout();
    handleFitView();
  }, [onLayout, handleFitView, showSidebar]);

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener('resize', handleFitView);
    return () => {
      window.removeEventListener('resize', handleFitView);
    };
  }, [handleFitView]);

  const handleAddNode = useCallback(
    (
      nodeType: NodeType = 'normal',
      operation: 'manual' | 'auto' = 'manual'
    ) => {
      // Tạo ID sử dụng UUID v7 và loại bỏ dấu gạch ngang
      const uniqueId = uuidv7().replace(/-/g, '');
      const newNodeId = `n_${uniqueId}`;

      // Get the current viewport to position the node at the center
      const { x, y, zoom } = reactFlowInstance.getViewport();
      const reactFlowBounds = ref.current?.getBoundingClientRect();

      // Calculate the center position in the viewport
      let centerX = 0;
      let centerY = 0;

      if (reactFlowBounds) {
        // Convert screen coordinates to flow coordinates
        centerX = (reactFlowBounds.width / 2 - x) / zoom;
        centerY = (reactFlowBounds.height / 2 - y) / zoom;

        // Snap to grid with different calculations for auto nodes
        if (operation === 'auto') {
          // For auto nodes, adjust position to account for 45-degree rotation
          centerX = Math.round(centerX / 30) * 30 + 15;
          centerY = Math.round(centerY / 30) * 30 + 15;
        } else {
          // For regular nodes, use normal grid snapping
          centerX = Math.round(centerX / 30) * 30;
          centerY = Math.round(centerY / 30) * 30;
        }
      }

      // Default points based on node type
      let defaultPoints: Point[] = [];

      if (nodeType === 'start') {
        // Start nodes default with right and bottom points
        defaultPoints = [
          { id: `p_${uuidv7().replace(/-/g, '')}`, type: 'right' },
          { id: `p_${uuidv7().replace(/-/g, '')}`, type: 'bottom' }
        ];
      } else if (nodeType === 'finished') {
        // Finished nodes default with left and top points
        defaultPoints = [
          { id: `p_${uuidv7().replace(/-/g, '')}`, type: 'left' },
          { id: `p_${uuidv7().replace(/-/g, '')}`, type: 'top' }
        ];
      } else if (operation === 'auto') {
        // Auto nodes have fixed 3 points with specific roles and types
        defaultPoints = [
          {
            id: `p_${uuidv7().replace(/-/g, '')}`,
            type: 'top', // Input point on the top
            role: 'target', // Always target for input
            autoType: 'input'
          },
          {
            id: `p_${uuidv7().replace(/-/g, '')}`,
            type: 'right', // True point on the right
            role: 'source', // Always source for true/false
            autoType: 'true'
          },
          {
            id: `p_${uuidv7().replace(/-/g, '')}`,
            type: 'bottom', // False point at the bottom
            role: 'source', // Always source for true/false
            autoType: 'false'
          }
        ];
      } else {
        // Normal nodes can have multiple points in any position
        defaultPoints = [
          { id: `p_${uuidv7().replace(/-/g, '')}`, type: 'left' },
          { id: `p_${uuidv7().replace(/-/g, '')}`, type: 'right' }
        ];
      }

      const newNode: Node = {
        id: newNodeId,
        name:
          nodeType === 'start'
            ? 'Bắt đầu'
            : nodeType === 'finished'
              ? 'Hoàn thành'
              : `Nút ${flowData.nodes.length + 1}`,
        type: nodeType,
        operationType: operation,
        x: centerX,
        y: centerY,
        points: defaultPoints
      };

      const updatedData: ProcessData = {
        ...flowData,
        nodes: [...flowData.nodes, newNode]
      };

      updateFlowData(updatedData);
      onLayout();
    },
    [flowData, updateFlowData, onLayout, reactFlowInstance]
  );

  const handleNodesChange = useCallback(
    (changes: any[]) => {
      onNodesChange(changes);

      // Only handle position changes when dragging ends
      const positionChanges = changes.filter(
        change => change.type === 'position' && !change.dragging
      );

      if (positionChanges.length > 0) {
        const updatedNodes = flowData.nodes.map(node => {
          const change = positionChanges.find(c => c.id === node.id);
          if (change?.position) {
            return {
              ...node,
              x: change.position.x,
              y: change.position.y
            };
          }
          return node;
        });

        const updatedData: ProcessData = {
          ...flowData,
          nodes: updatedNodes
        };

        updateFlowData(updatedData);
      }
    },
    [flowData, updateFlowData, onNodesChange]
  );

  const hasStartNode = useMemo(() => {
    return flowData.nodes.some(node => node.type === 'start');
  }, [flowData.nodes]);

  const hasFinishedNode = useMemo(() => {
    return flowData.nodes.some(node => node.type === 'finished');
  }, [flowData.nodes]);

  useEffect(() => {
    // fix lỗi render
    if (edges.length > 0) {
      setTimeout(() => {
        setNodes(_.cloneDeep(nodes));
      }, 100);
    }
  }, [edges]);

  return (
    <div className="flex h-full overflow-hidden rounded-lg border">
      <div className="flex-1 overflow-hidden border-r" ref={ref}>
        <ReactFlow
          key={nodes.length}
          nodeTypes={memoizedNodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onConnect={onConnect}
          connectOnClick={false}
          nodesConnectable={false}
          edgesFocusable={false}
          snapToGrid
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'inherit'
          }}
          fitView
          fitViewOptions={fitViewOptions}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={4}
          snapGrid={[10, 10]}
          defaultEdgeOptions={{
            style: { strokeWidth: 1, stroke: '#9CA3AF' }
          }}
        >
          <Background color="#CBD5E1" gap={15} size={2} />
          <Controls />
          <div className="absolute left-4 top-4 z-10 flex gap-2">
            <Button
              className="flex gap-1 border border-gray-300 bg-white text-xs text-gray-600 hover:bg-gray-100"
              onClick={() => handleAddNode('normal')}
              type="button"
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span className="font-medium">Nút thường</span>
            </Button>
            <Button
              className="text-appWhite flex gap-1 bg-green-600 text-xs hover:bg-green-700 disabled:bg-gray-300 disabled:opacity-100"
              onClick={() => handleAddNode('start')}
              type="button"
              disabled={hasStartNode}
              title={
                hasStartNode ? 'Đã tồn tại nút bắt đầu' : 'Thêm nút bắt đầu'
              }
            >
              <PlayIcon className="h-4 w-4" />
              <span className="font-medium">Nút bắt đầu</span>
            </Button>
            <Button
              className="text-appWhite flex gap-1 bg-purple-600 text-xs hover:bg-purple-700 disabled:bg-gray-300 disabled:opacity-100"
              onClick={() => handleAddNode('finished')}
              type="button"
              disabled={hasFinishedNode}
              title={
                hasFinishedNode
                  ? 'Đã tồn tại nút hoàn thành'
                  : 'Thêm nút hoàn thành'
              }
            >
              <CheckIcon className="h-4 w-4" />
              <span className="font-medium">Nút hoàn thành</span>
            </Button>
            <Button
              className="text-appWhite flex gap-1 bg-orange-500 text-xs hover:bg-orange-600"
              onClick={() => handleAddNode('normal', 'auto')}
              type="button"
            >
              <ZapIcon className="h-4 w-4" />
              <span className="font-medium">Nút tự động</span>
            </Button>
          </div>
        </ReactFlow>
      </div>
      <Show when={showSidebar}>
        <div className="relative overflow-hidden">
          <div
            className={cn(
              'hover:bg-appBlue/5 group absolute -left-2 top-0 z-50 flex h-full w-4 cursor-col-resize items-center justify-center',
              isResizing && 'bg-appBlue/10'
            )}
            onMouseDown={startResizing}
          >
            <GripVertical className="text-muted-foreground/50 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <PropertySidebar
            onClose={handleCloseSidebar}
            width={sidebarWidth}
            title={
              selectedNode
                ? 'Thuộc tính nút'
                : selectedFlow
                  ? 'Thuộc tính quy trình'
                  : ''
            }
          >
            {selectedNode ? (
              <NodeProperty
                selectedNode={selectedNode}
                onNodeUpdate={handleNodeUpdate}
                onNodeDelete={handleNodeDelete}
                objectType={objectType}
              />
            ) : (
              <FlowProperty
                selectedFlow={selectedFlow}
                onFlowUpdate={handleFlowUpdate}
                onFlowDelete={handleFlowDelete}
              />
            )}
          </PropertySidebar>
        </div>
      </Show>
    </div>
  );
};
