import _ from 'lodash';
import { CheckCircle2Icon, GripVertical } from 'lucide-react';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Button, Input } from '@minhdtb/storeo-theme';

type Point = {
  id: string;
  type: 'top' | 'bottom' | 'right' | 'left';
};

type Node = {
  id: string;
  name: string;
  description: string;
  condition: string;
  x: number;
  y: number;
  points: Point[];
};

type Flow = {
  id: string;
  action?: string;
  approve?: boolean;
  type?: string;
  from: {
    node: string;
    point: string;
  };
  to: {
    node: string;
    point: string;
  };
};

export type ProcessData = {
  done: string;
  nodes: Node[];
  flows: Flow[];
};

type PointRole = 'source' | 'target' | 'unknown';

const CustomNode = ({
  data
}: {
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
}) => {
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

type NodeSidebarProps = {
  selectedNode: Node | null;
  onNodeUpdate?: (nodeId: string, updates: Partial<Node>) => void;
};

const NodeSidebar: FC<NodeSidebarProps> = ({ selectedNode, onNodeUpdate }) => {
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  useEffect(() => {
    if (selectedNode) {
      setNodeName(selectedNode.name);
    }
  }, [selectedNode]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value);
  };

  const handleAccept = () => {
    if (selectedNode && nodeName !== selectedNode.name) {
      onNodeUpdate?.(selectedNode.id, { name: nodeName });
    }
  };

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.pageX;
    startWidthRef.current = sidebarRef.current?.offsetWidth ?? 300;
    setIsResizing(true);
  }, []);

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = startXRef.current - e.pageX;
      const newWidth = Math.min(
        Math.max(startWidthRef.current + diff, 200),
        300
      );
      setWidth(newWidth);
    },
    [isResizing, startXRef, startWidthRef]
  );

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

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

  return (
    <>
      <div
        ref={sidebarRef}
        className="border-border bg-background relative flex flex-none flex-col border-l"
        style={{ width: `${width}px` }}
      >
        <div className="border-border bg-appBlue flex items-center justify-between border-b p-2">
          <h3 className="text-appWhite text-lg font-medium">Thuộc tính node</h3>
        </div>
        <div
          className={cn(
            'hover:bg-appBlue/5 group absolute -left-2 top-0 z-50 flex h-full w-4 cursor-col-resize items-center justify-center',
            isResizing && 'bg-appBlue/10'
          )}
          onMouseDown={startResizing}
        >
          <GripVertical className="text-muted-foreground/50 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên node</label>
                <div className="flex gap-2">
                  <Input
                    value={nodeName}
                    onChange={handleNameChange}
                    placeholder="Nhập tên node"
                  />
                  <Button
                    onClick={handleAccept}
                    disabled={!nodeName || nodeName === selectedNode.name}
                  >
                    Chấp nhận
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-center text-sm">
              Chọn một node để xem thông tin
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const FlowEditor: FC<FlowEditorProps> = ({ data, onChange }) => {
  const { fitView } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowData, setFlowData] = useState(data);

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodesById = useMemo(
    () =>
      Object.fromEntries(flowData.request.nodes.map(node => [node.id, node])),
    [flowData.request.nodes]
  );

  console.log(nodesById);

  const handleNodeClick = useCallback(
    (_: any, node: { id: string }) => {
      const foundNode = nodesById[node.id];
      if (foundNode) {
        setSelectedNode(foundNode);
      }
    },
    [nodesById]
  );

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

  // Only run layout when data changes
  useEffect(() => {
    onLayout();
    // Use RAF to avoid layout thrashing
    requestAnimationFrame(() => {
      fitView();
    });
  }, [onLayout, fitView]);

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
        />
      </div>
      <NodeSidebar
        selectedNode={selectedNode}
        onNodeUpdate={handleNodeUpdate}
      />
    </div>
  );
};
