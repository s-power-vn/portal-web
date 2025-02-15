import _ from 'lodash';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from 'reactflow';

import { Show } from '@minhdtb/storeo-core';

import { CustomNode } from './custom-node';
import { FlowProperty } from './flow-property';
import { NodeProperty } from './node-property';
import { nextTick } from './process-flow';
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

    // Split points into sources and targets
    const sources = mappedPoints.filter(point => point.role === 'source');
    const targets = mappedPoints.filter(point => point.role === 'target');
    const unknownPoints = mappedPoints.filter(
      point => point.role === 'unknown'
    );

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
        sources: [...sources],
        targets: [...targets, ...unknownPoints],
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

const nodeTypes = { customNode: CustomNode };

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

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
        setTimeout(() => {
          handleFitView();
        }, 100);
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
        setTimeout(() => {
          handleFitView();
        }, 100);
      }
    },
    [flowsById, handleFitView]
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
        // Preserve existing node position if it exists
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

    setEdges(newEdges);
    await nextTick(10);
    setNodes(newNodes);
  }, [
    flowData.request,
    selectedFlow,
    selectedNode,
    setEdges,
    setNodes,
    sourcePoint,
    updateFlowData
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
    <div className="flex h-full">
      <div className="flex-1" ref={ref}>
        <ReactFlow
          nodeTypes={memoizedNodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeInternal}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onConnect={handleConnect}
          connectOnClick={false}
          snapToGrid
          fitView
          fitViewOptions={fitViewOptions}
        />
      </div>
      <Show when={showSidebar}>
        <PropertySidebar
          title={selectedNode ? 'Thuộc tính node' : 'Thuộc tính flow'}
          onClose={handleCloseSidebar}
          onResizeEnd={handleFitView}
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
      </Show>
    </div>
  );
};
