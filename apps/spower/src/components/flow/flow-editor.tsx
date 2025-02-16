import {
  Background,
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
import { GripVertical } from 'lucide-react';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Show, cn } from '@minhdtb/storeo-core';

import { CustomNode } from './custom-node';
import { FlowProperty } from './flow-property';
import { NodeProperty } from './node-property';
import { PropertySidebar } from './property-sidebar';
import type { Flow, Node, PointRole, ProcessData } from './types';

function getNodes(
  data: ProcessData,
  selectedNode: Node | null,
  sourcePoint: { nodeId: string; pointId: string } | null
) {
  return data.nodes.map(node => {
    const { id, x, y, points, ...rest } = node;

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
      flow => flow.from.node === id && flow.approve
    );

    return {
      id,
      type: 'customNode',
      data: {
        ...rest,
        nodeId: id,
        isApprove,
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
        stroke: isSelected ? '#4B5563' : '#9CA3AF'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
        color: isSelected ? '#4B5563' : '#9CA3AF'
      }
    };
  });
}

const nodeTypes: NodeTypes = {
  customNode: CustomNode
};

export type FlowEditorProps = {
  data: {
    request: ProcessData;
  };
  onChange?: (data: { request: ProcessData }) => void;
};

export const FlowEditor: FC<FlowEditorProps> = ({ data, onChange }) => {
  const { fitView } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [flowData, setFlowData] = useState(data);
  const [showSidebar, setShowSidebar] = useState(true);
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

  const flowsById = useMemo(
    () =>
      Object.fromEntries(flowData.request.flows.map(flow => [flow.id, flow])),
    [flowData.request.flows]
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
    (updatedData: typeof flowData) => {
      if (!_.isEqual(flowData, updatedData)) {
        setFlowData(updatedData);
        onChange?.(updatedData);
      }
    },
    [flowData, onChange]
  );

  const onLayout = useCallback(async () => {
    const newEdges = getEdges(flowData.request, selectedFlow);
    const newNodes = getNodes(flowData.request, selectedNode, sourcePoint).map(
      node => {
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

                // Check if flow already exists
                const flowExists = flowData.request.flows.some(
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
                const existingFlows = flowData.request.flows.filter(flow =>
                  flow.id.startsWith(baseId)
                );
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

                const updatedData = {
                  request: {
                    ...flowData.request,
                    flows: [...flowData.request.flows, newFlow]
                  }
                };

                updateFlowData(updatedData);
                setSourcePoint(null);
                onLayout();
              }
            }
          }
        };
      }
    );

    // Batch update nodes and edges together
    requestAnimationFrame(() => {
      setNodes(newNodes);
      setEdges(newEdges);
    });

    setTimeout(() => {
      requestAnimationFrame(() => {
        setNodes(newNodes);
        setEdges(newEdges);
      });
    }, 200);
  }, [
    flowData.request,
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
      const updatedFlows = flowData.request.flows.map(flow =>
        flow.id === flowId ? { ...flow, ...updates } : flow
      );

      const updatedData = {
        request: {
          ...flowData.request,
          flows: updatedFlows
        }
      };

      updateFlowData(updatedData);
      onLayout();
    },
    [flowData.request, updateFlowData, onLayout]
  );

  const updateNodeInternals = useUpdateNodeInternals();

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<Node>) => {
      const updatedNodes = flowData.request.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      );

      let updatedFlows = flowData.request.flows;

      if (updates.points) {
        const node = updatedNodes.find(n => n.id === nodeId);
        if (node) {
          const currentPointIds = new Set(node.points.map(p => p.id));
          updatedFlows = flowData.request.flows.filter(flow => {
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

          requestAnimationFrame(() => {
            updateNodeInternals(nodeId);
          });
        }
      }

      const updatedData = {
        request: {
          ...flowData.request,
          nodes: updatedNodes,
          flows: updatedFlows
        }
      };

      console.log('updatedData', updatedData);

      updateFlowData(updatedData);
      onLayout();
    },
    [flowData.request, updateFlowData, onLayout, updateNodeInternals]
  );

  const handleFlowDelete = useCallback(
    async (flowId: string) => {
      const flowToDelete = flowData.request.flows.find(
        flow => flow.id === flowId
      );
      const updatedFlows = flowData.request.flows.filter(
        flow => flow.id !== flowId
      );

      // Reset roles for points involved in the deleted flow
      const updatedNodes = flowData.request.nodes.map(node => {
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

      const updatedData = {
        request: {
          ...flowData.request,
          nodes: updatedNodes,
          flows: updatedFlows
        }
      };

      updateFlowData(updatedData);
      setSelectedFlow(null);
      await onLayout();
    },
    [flowData.request, updateFlowData, onLayout]
  );

  const handleNodeDelete = useCallback(
    async (nodeId: string) => {
      const updatedNodes = flowData.request.nodes.filter(
        node => node.id !== nodeId
      );
      const updatedFlows = flowData.request.flows.filter(
        flow => flow.from.node !== nodeId && flow.to.node !== nodeId
      );

      const updatedData = {
        request: {
          ...flowData.request,
          nodes: updatedNodes,
          flows: updatedFlows
        }
      };

      updateFlowData(updatedData);
      setSelectedNode(null);
      await onLayout();
    },
    [flowData.request, updateFlowData, onLayout]
  );

  const handleConnect = useCallback(
    (params: {
      source: string | null;
      sourceHandle: string | null;
      target: string | null;
      targetHandle: string | null;
    }) => {
      if (
        !params.source ||
        !params.target ||
        !params.sourceHandle ||
        !params.targetHandle
      ) {
        return;
      }

      const sourceNodeId = params.source;
      const targetNodeId = params.target;
      const sourcePointId = params.sourceHandle.split('#')[1];
      const targetPointId = params.targetHandle.split('#')[1];

      // Check if flow already exists
      const flowExists = flowData.request.flows.some(
        flow =>
          flow.from.node === sourceNodeId &&
          flow.from.point === sourcePointId &&
          flow.to.node === targetNodeId &&
          flow.to.point === targetPointId
      );

      if (flowExists) {
        return;
      }

      // Generate flow ID
      const baseId = `${sourceNodeId}-${targetNodeId}`;
      const existingFlows = flowData.request.flows.filter(flow =>
        flow.id.startsWith(baseId)
      );
      const newFlowNumber = existingFlows.length + 1;
      const newFlowId = `${baseId}#${newFlowNumber}`;

      const newFlow: Flow = {
        id: newFlowId,
        from: {
          node: sourceNodeId,
          point: sourcePointId
        },
        to: {
          node: targetNodeId,
          point: targetPointId
        }
      };

      const updatedData = {
        request: {
          ...flowData.request,
          flows: [...flowData.request.flows, newFlow]
        }
      };

      updateFlowData(updatedData);
      onLayout();
    },
    [flowData.request, updateFlowData, onLayout]
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

  const ref = useRef(null);

  useEffect(() => {
    window.addEventListener('resize', handleFitView);
    return () => {
      window.removeEventListener('resize', handleFitView);
    };
  }, [handleFitView]);

  return (
    <div className="flex h-full overflow-hidden rounded-lg border">
      <div className="flex-1 overflow-hidden border-r" ref={ref}>
        <ReactFlow
          nodeTypes={memoizedNodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onConnect={handleConnect}
          connectOnClick={false}
          snapToGrid
          fitView
          fitViewOptions={fitViewOptions}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={4}
          snapGrid={[15, 15]}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'inherit'
          }}
          defaultEdgeOptions={{
            style: { strokeWidth: 1, stroke: '#9CA3AF' }
          }}
        >
          <Background color="#CBD5E1" gap={15} size={2} />
          <div className="absolute bottom-2 left-2 rounded bg-white/50 p-2 text-xs text-gray-500">
            Sử dụng chuột để phóng to • Kéo để di chuyển
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
            title={selectedNode ? 'Thuộc tính node' : 'Thuộc tính flow'}
            onClose={handleCloseSidebar}
            width={sidebarWidth}
          >
            {selectedNode ? (
              <NodeProperty
                selectedNode={selectedNode}
                onNodeUpdate={handleNodeUpdate}
                onNodeDelete={handleNodeDelete}
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
