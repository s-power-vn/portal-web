export type PointRole = 'source' | 'target' | 'unknown';

export type FlowType = 'default' | 'straight' | 'step' | 'smoothstep';

export type Point = {
  id: string;
  type: 'top' | 'bottom' | 'right' | 'left';
  role?: PointRole;
};

export type NodeType = 'start' | 'finished' | 'normal';

export type OperationType = 'auto' | 'manual';

export type Node = {
  id: string;
  name: string;
  description?: string;
  condition?: string;
  type: NodeType;
  operationType: OperationType;
  x: number;
  y: number;
  points: Point[];
};

export type Flow = {
  id: string;
  from: {
    node: string;
    point: string;
  };
  to: {
    node: string;
    point: string;
  };
  type?: FlowType;
  action?: string;
  approver?: string[];
};

export type ProcessData = {
  nodes: Node[];
  flows: Flow[];
};
