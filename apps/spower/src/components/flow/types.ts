export type Point = {
  id: string;
  type: 'top' | 'bottom' | 'right' | 'left';
};

export type Node = {
  id: string;
  name: string;
  description: string;
  condition: string;
  x: number;
  y: number;
  points: Point[];
};

export type Flow = {
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

export type PointRole = 'source' | 'target' | 'unknown';
