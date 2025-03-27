export type PointRole = 'source' | 'target' | 'unknown';

export type PointType = 'top' | 'bottom' | 'right' | 'left';

export type AutoNodePointType =
  | 'input'
  | 'true'
  | 'false'
  | 'output'
  | 'reject';

export type FlowType = 'default' | 'straight' | 'step' | 'smoothstep';

export type NodeType = 'start' | 'finish' | 'normal' | 'auto' | 'approval';

export type Point = {
  id: string;
  type: PointType;
  role?: PointRole;
  autoType?: AutoNodePointType;
};

export type Node = {
  id: string;
  name: string;
  description?: string;
  type: NodeType;
  x: number;
  y: number;
  points: Point[];
  condition?: string;
  approvers?: string[];
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
};

export type ProcessData = {
  nodes: Node[];
  flows: Flow[];
};
