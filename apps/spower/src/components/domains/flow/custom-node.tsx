import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import _ from 'lodash';
import { CheckCircle2Icon } from 'lucide-react';

import { FC, useMemo } from 'react';

import { Show, cn } from '@minhdtb/storeo-core';

import type { PointRole } from './types';

export type CustomNodeProps = NodeProps<
  Node<{
    nodeId: string;
    name: string;
    description: string;
    active: boolean;
    isApprove: boolean;
    done: boolean;
    selected: boolean;
    clicked: boolean;
    points: {
      id: string;
      type: 'top' | 'bottom' | 'right' | 'left';
      role: PointRole;
    }[];
    onPointClick: (pointId: string, nodeId: string) => void;
    sourcePoint: { nodeId: string; pointId: string } | null;
  }>
>;

export const CustomNode: FC<CustomNodeProps> = ({ data }) => {
  const { leftPoints, topPoints, rightPoints, bottomPoints } = useMemo(() => {
    const sortByPointId = (points: typeof data.points) => {
      return _.sortBy(points, point => {
        const match = point.id.match(/p(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    };

    return {
      leftPoints: sortByPointId(
        data.points.filter(point => point.type === 'left')
      ),
      topPoints: sortByPointId(
        data.points.filter(point => point.type === 'top')
      ),
      rightPoints: sortByPointId(
        data.points.filter(point => point.type === 'right')
      ),
      bottomPoints: sortByPointId(
        data.points.filter(point => point.type === 'bottom')
      )
    };
  }, [data.points]);

  const handlePointClick = (pointId: string) => {
    const point = data.points.find(p => p.id === pointId);
    if (point && point.role === 'unknown') {
      data.onPointClick(pointId, data.nodeId);
    }
  };

  return (
    <>
      <div
        className={cn(
          'box-border flex min-w-40 items-center justify-center gap-2 rounded border-2 bg-white p-2 text-xs shadow-sm transition-all',
          data.active ? 'border-appError' : 'border-gray-200',
          data.selected ? 'border-gray-400 bg-gray-50 shadow-md' : '',
          data.clicked ? 'ring-2 ring-gray-200' : ''
        )}
      >
        <Show when={data.active}>
          <div className={'bg-appError h-3 w-3 rounded-full'}></div>
        </Show>
        <span>{data.name}</span>
        <Show when={data.isApprove}>
          <CheckCircle2Icon className="h-4 w-4 text-blue-500" />
        </Show>
        <Show when={data.done}>
          <div className={'bg-appSuccess h-3 w-3 rounded-full'}></div>
        </Show>
      </div>
      {leftPoints.reverse().map((point, index) => (
        <Handle
          key={point.id}
          type={
            point.role === 'source' || point.role === 'unknown'
              ? 'source'
              : 'target'
          }
          position={Position.Left}
          id={point.id}
          className={cn(
            'origin-center transition-all hover:scale-150',
            data.sourcePoint?.pointId === point.id ? 'scale-150' : ''
          )}
          style={{
            top: `${(index + 1) * (100 / (leftPoints.length + 1))}%`,
            opacity: point.role === 'unknown' ? 0.3 : 1,
            background:
              data.sourcePoint?.pointId === point.id
                ? '#CC313D'
                : point.role === 'unknown'
                  ? '#9CA3AF'
                  : '#4B5563',
            cursor: 'pointer',
            width: '10px',
            height: '10px',
            border: '2px solid white',
            borderRadius: '2px',
            transform: 'translate(calc(-50% - 2px), -50%)'
          }}
          onClick={() => handlePointClick(point.id)}
        />
      ))}
      {topPoints.map((point, index) => (
        <Handle
          key={point.id}
          type={
            point.role === 'source' || point.role === 'unknown'
              ? 'source'
              : 'target'
          }
          position={Position.Top}
          id={point.id}
          className={cn(
            'origin-center transition-all hover:scale-150',
            data.sourcePoint?.pointId === point.id ? 'scale-150' : ''
          )}
          style={{
            left: `${(index + 1) * (100 / (topPoints.length + 1))}%`,
            opacity: point.role === 'unknown' ? 0.3 : 1,
            background:
              data.sourcePoint?.pointId === point.id
                ? '#CC313D'
                : point.role === 'unknown'
                  ? '#9CA3AF'
                  : '#4B5563',
            cursor: 'pointer',
            width: '10px',
            height: '10px',
            border: '2px solid white',
            borderRadius: '2px',
            transform: 'translate(-50%, calc(-50% - 2px))'
          }}
          onClick={() => handlePointClick(point.id)}
        />
      ))}
      {rightPoints.map((point, index) => (
        <Handle
          key={point.id}
          type={
            point.role === 'source' || point.role === 'unknown'
              ? 'source'
              : 'target'
          }
          position={Position.Right}
          id={point.id}
          className={cn(
            'origin-center transition-all hover:scale-150',
            data.sourcePoint?.pointId === point.id ? 'scale-150' : ''
          )}
          style={{
            top: `${(index + 1) * (100 / (rightPoints.length + 1))}%`,
            opacity: point.role === 'unknown' ? 0.3 : 1,
            background:
              data.sourcePoint?.pointId === point.id
                ? '#CC313D'
                : point.role === 'unknown'
                  ? '#9CA3AF'
                  : '#4B5563',
            cursor: 'pointer',
            width: '10px',
            height: '10px',
            border: '2px solid white',
            borderRadius: '2px',
            transform: 'translate(calc(50% + 2px), -50%)'
          }}
          onClick={() => handlePointClick(point.id)}
        />
      ))}
      {bottomPoints.reverse().map((point, index) => (
        <Handle
          key={point.id}
          type={
            point.role === 'source' || point.role === 'unknown'
              ? 'source'
              : 'target'
          }
          position={Position.Bottom}
          id={point.id}
          className={cn(
            'origin-center transition-all hover:scale-150',
            data.sourcePoint?.pointId === point.id ? 'scale-150' : ''
          )}
          style={{
            left: `${(index + 1) * (100 / (bottomPoints.length + 1))}%`,
            opacity: point.role === 'unknown' ? 0.3 : 1,
            background:
              data.sourcePoint?.pointId === point.id
                ? '#CC313D'
                : point.role === 'unknown'
                  ? '#9CA3AF'
                  : '#4B5563',
            cursor: 'pointer',
            width: '10px',
            height: '10px',
            border: '2px solid white',
            borderRadius: '2px',
            transform: 'translate(-50%, calc(50% + 2px))'
          }}
          onClick={() => handlePointClick(point.id)}
        />
      ))}
    </>
  );
};
