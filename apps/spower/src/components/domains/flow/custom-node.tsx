import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import _ from 'lodash';
import { CheckCircle2Icon, CheckIcon, PlayIcon, ZapIcon } from 'lucide-react';

import { FC, useMemo } from 'react';

import { Show, cn } from '@minhdtb/storeo-core';

import type {
  AutoNodePointType,
  NodeType,
  OperationType,
  PointRole
} from './types';

export type CustomNodeProps = NodeProps<
  Node<{
    nodeId: string;
    name: string;
    description: string;
    active: boolean;
    type: NodeType;
    operationType: OperationType;
    selected: boolean;
    clicked: boolean;
    points: {
      id: string;
      type: 'top' | 'bottom' | 'right' | 'left';
      role: PointRole;
      autoType?: AutoNodePointType;
    }[];
    onPointClick: (pointId: string, nodeId: string) => void;
    sourcePoint: { nodeId: string; pointId: string } | null;
    condition: boolean;
    isView: boolean;
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
          'relative box-border flex items-center justify-center gap-2 rounded border-2 bg-white shadow-sm transition-all',
          data.active ? 'border-appError' : 'border-gray-200',
          data.selected ? 'border-gray-400 bg-gray-50 shadow-md' : '',
          data.clicked ? 'ring-2 ring-gray-200' : '',
          data.type === 'start' ? 'bg-green-50' : '',
          data.type === 'finished' ? 'bg-purple-50' : '',
          data.operationType === 'auto'
            ? 'h-[60px] w-[60px] rotate-45 bg-orange-50'
            : data.operationType === 'approval'
              ? 'h-[60px] w-[60px] bg-blue-50'
              : 'min-h-[40px] w-[200px] p-2 text-xs'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center gap-2',
            data.operationType === 'auto' ? 'w-[85px] -rotate-45' : ''
          )}
        >
          <Show when={data.active}>
            <div className={'bg-appError h-3 w-3 rounded-full'}></div>
          </Show>

          <Show when={data.type === 'start'}>
            <PlayIcon className="h-4 w-4 text-green-500" />
          </Show>

          <Show when={data.operationType === 'auto'}>
            <ZapIcon className="h-4 w-4 text-orange-500" />
          </Show>

          <Show when={data.operationType === 'approval'}>
            <CheckCircle2Icon className="h-4 w-4 text-blue-500" />
          </Show>

          <Show
            when={
              data.operationType !== 'auto' && data.operationType !== 'approval'
            }
          >
            <span>{data.name}</span>
          </Show>

          <Show when={data.type === 'finished'}>
            <CheckIcon className="h-4 w-4 text-purple-500" />
          </Show>
        </div>
      </div>
      {leftPoints.reverse().map((point, index) => (
        <div key={point.id}>
          <Handle
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
              opacity: data.isView ? 0 : 1,
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
              borderRadius: '50%',
              transform: `translate(calc(-50% - ${data.isView ? '-5px' : point.autoType ? '8px' : '5px'}), -50%)`
            }}
            onClick={() => handlePointClick(point.id)}
          />
          {point.autoType && (
            <div
              className="absolute"
              style={{
                left: '5px',
                top: `${(index + 1) * (100 / (leftPoints.length + 1))}%`,
                transform: `translate(calc(-50% - ${data.isView ? '-5px' : '5px'}), -50%)`,
                width: '6px',
                height: '6px',
                backgroundColor:
                  point.autoType === 'input'
                    ? '#22C55E'
                    : point.autoType === 'true'
                      ? '#3B82F6'
                      : '#EF4444'
              }}
            />
          )}
        </div>
      ))}
      {topPoints.map((point, index) => (
        <div key={point.id}>
          <Handle
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
              left:
                data.operationType === 'auto'
                  ? '50%'
                  : `${(index + 1) * (100 / (topPoints.length + 1))}%`,
              opacity: data.isView ? 0 : 1,
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
              borderRadius: '50%',
              transform: `translate(-50%, calc(-50% - ${data.isView ? '-5px' : point.autoType ? '8px' : '5px'}))`
            }}
            onClick={() => handlePointClick(point.id)}
          />
          {point.autoType && (
            <div
              className="absolute"
              style={{
                left:
                  data.operationType === 'auto'
                    ? '50%'
                    : `${(index + 1) * (100 / (topPoints.length + 1))}%`,
                top: '5px',
                transform: `translate(-50%, calc(-50% - ${data.isView ? '-5px' : '5px'}))`,
                width: '6px',
                height: '6px',
                backgroundColor:
                  point.autoType === 'input'
                    ? '#22C55E'
                    : point.autoType === 'true'
                      ? '#3B82F6'
                      : '#EF4444'
              }}
            />
          )}
        </div>
      ))}
      {rightPoints.map((point, index) => (
        <div key={point.id}>
          <Handle
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
              top:
                data.operationType === 'auto'
                  ? '50%'
                  : `${(index + 1) * (100 / (rightPoints.length + 1))}%`,
              opacity: data.isView ? 0 : 1,
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
              borderRadius: '50%',
              transform: `translate(calc(50% + ${data.isView ? '-5px' : point.autoType ? '8px' : '5px'}), -50%)`
            }}
            onClick={() => handlePointClick(point.id)}
          />
          {point.autoType && (
            <div
              className="absolute"
              style={{
                right: '0',
                top:
                  data.operationType === 'auto'
                    ? '50%'
                    : `${(index + 1) * (100 / (rightPoints.length + 1))}%`,
                transform: `translate(calc(-50% + ${data.isView ? '-5px' : '5px'}), -50%)`,
                width: '6px',
                height: '6px',
                backgroundColor:
                  point.autoType === 'input'
                    ? '#22C55E'
                    : point.autoType === 'true'
                      ? '#3B82F6'
                      : '#EF4444'
              }}
            />
          )}
        </div>
      ))}
      {bottomPoints.reverse().map((point, index) => (
        <div key={point.id}>
          <Handle
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
              left:
                data.operationType === 'auto'
                  ? '50%'
                  : `${(index + 1) * (100 / (bottomPoints.length + 1))}%`,
              opacity: data.isView ? 0 : 1,
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
              borderRadius: '50%',
              transform: `translate(-50%, calc(50% + ${data.isView ? '-5px' : point.autoType ? '8px' : '5px'}))`
            }}
            onClick={() => handlePointClick(point.id)}
          />
          {point.autoType && (
            <div
              className="absolute"
              style={{
                left:
                  data.operationType === 'auto'
                    ? '50%'
                    : `${(index + 1) * (100 / (bottomPoints.length + 1))}%`,
                bottom: '5px',
                transform: `translate(-50%, calc(50% + ${data.isView ? '-5px' : '5px'}))`,
                width: '6px',
                height: '6px',
                backgroundColor:
                  point.autoType === 'input'
                    ? '#22C55E'
                    : point.autoType === 'true'
                      ? '#3B82F6'
                      : '#EF4444'
              }}
            />
          )}
        </div>
      ))}
    </>
  );
};
