import _ from 'lodash';
import { CheckCircle2Icon } from 'lucide-react';

import { FC, useMemo } from 'react';
import { Handle, Position } from 'reactflow';

import { Show, cn } from '@minhdtb/storeo-core';

import type { PointRole } from './types';

export type CustomNodeProps = {
  data: {
    nodeId: string;
    name: string;
    description: string;
    active: boolean;
    isApprove: boolean;
    selected: boolean;
    clicked: boolean;
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
    onPointClick: (pointId: string, nodeId: string) => void;
    sourcePoint: { nodeId: string; pointId: string } | null;
  };
};

export const CustomNode: FC<CustomNodeProps> = ({ data }) => {
  const points = useMemo(() => {
    const pointMap = new Map();
    data.sources.forEach(point => pointMap.set(point.id, point));
    data.targets.forEach(point => {
      if (!pointMap.has(point.id)) {
        pointMap.set(point.id, point);
      }
    });
    return Array.from(pointMap.values());
  }, [data.sources, data.targets]);

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

  const handlePointClick = (pointId: string) => {
    data.onPointClick(pointId, data.nodeId);
  };

  return (
    <>
      <div
        className={cn(
          'flex w-40 items-center justify-center gap-2 rounded border p-2 text-xs shadow-sm transition-all',
          data.active ? 'border-appError' : 'border-gray-200',
          data.selected ? 'border-gray-400 bg-gray-50 shadow-md' : ''
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
          type={
            point.role === 'source' || point.role === 'unknown'
              ? 'source'
              : 'target'
          }
          position={Position.Left}
          id={point.id}
          className={cn(
            'origin-center transition-all hover:scale-150',
            data.sourcePoint?.pointId === point.id
              ? 'scale-150 !bg-blue-500'
              : ''
          )}
          style={{
            top: `${(index + 1) * (100 / (leftPoints.length + 1))}%`,
            opacity: point.role === 'unknown' ? 0.3 : 1,
            background: point.role === 'unknown' ? '#9CA3AF' : '#4B5563',
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
            data.sourcePoint?.pointId === point.id
              ? 'scale-150 !bg-blue-500'
              : ''
          )}
          style={{
            left: `${(index + 1) * (100 / (topPoints.length + 1))}%`,
            opacity: point.role === 'unknown' ? 0.3 : 1,
            background: point.role === 'unknown' ? '#9CA3AF' : '#4B5563',
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
            data.sourcePoint?.pointId === point.id
              ? 'scale-150 !bg-blue-500'
              : ''
          )}
          style={{
            top: `${(index + 1) * (100 / (rightPoints.length + 1))}%`,
            opacity: point.role === 'unknown' ? 0.3 : 1,
            background: point.role === 'unknown' ? '#9CA3AF' : '#4B5563',
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
            data.sourcePoint?.pointId === point.id
              ? 'scale-150 !bg-blue-500'
              : ''
          )}
          style={{
            left: `${(index + 1) * (100 / (bottomPoints.length + 1))}%`,
            opacity: point.role === 'unknown' ? 0.3 : 1,
            background: point.role === 'unknown' ? '#9CA3AF' : '#4B5563',
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
