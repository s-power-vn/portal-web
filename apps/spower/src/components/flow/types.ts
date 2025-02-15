export type PointRole = 'source' | 'target' | 'unknown';

export type Point = {
  id: string;
  type: 'top' | 'bottom' | 'right' | 'left';
  role?: PointRole;
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
  from: {
    node: string;
    point: string;
  };
  to: {
    node: string;
    point: string;
  };
  type?: string;
  action?: string;
  approve?: boolean;
};

export type ProcessData = {
  nodes: Node[];
  flows: Flow[];
  done?: string;
};
