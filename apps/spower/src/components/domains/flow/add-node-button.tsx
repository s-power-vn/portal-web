import {
  CheckCircle2Icon,
  CheckIcon,
  PlayIcon,
  PlusIcon,
  ZapIcon
} from 'lucide-react';

import { FC, useMemo, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@minhdtb/storeo-theme';

import { NodeType } from './types';

const NODE_TYPES: {
  id: NodeType;
  label: string;
  icon: React.ElementType;
  description: string;
  className?: string;
}[] = [
  {
    id: 'normal',
    label: 'Thường',
    icon: PlusIcon,
    description: 'Tạo một nút thường trong quy trình'
  },
  {
    id: 'start',
    label: 'Bắt đầu',
    icon: PlayIcon,
    description: 'Điểm bắt đầu của quy trình',
    className: 'text-green-600'
  },
  {
    id: 'finish',
    label: 'Hoàn thành',
    icon: CheckIcon,
    description: 'Điểm kết thúc của quy trình',
    className: 'text-purple-600'
  },
  {
    id: 'auto',
    label: 'Tự động',
    icon: ZapIcon,
    description: 'Nút xử lý tự động trong quy trình',
    className: 'text-orange-500'
  },
  {
    id: 'approval',
    label: 'Phê duyệt',
    icon: CheckCircle2Icon,
    description: 'Nút phê duyệt trong quy trình',
    className: 'text-blue-500'
  }
];

export type AddNodeButtonProps = {
  onAddNode: (type: NodeType) => void;
  hasStartNode: boolean;
  hasFinishedNode: boolean;
};

export const AddNodeButton: FC<AddNodeButtonProps> = ({
  onAddNode,
  hasStartNode,
  hasFinishedNode
}) => {
  const [open, setOpen] = useState(false);

  const filteredNodeTypes = useMemo(() => {
    return NODE_TYPES.filter(type => {
      if (type.id === 'start' && hasStartNode) return false;
      if (type.id === 'finish' && hasFinishedNode) return false;
      return true;
    });
  }, [hasStartNode, hasFinishedNode]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          className=" bg-appBlue ring-offset-background focus-visible:ring-ring hover:bg-appBlueLight inline-flex h-9 cursor-pointer
           items-center justify-center gap-1 rounded-md px-3 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm nút
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0"
        side="bottom"
        align="start"
        sideOffset={2}
      >
        <div className="py-1">
          {filteredNodeTypes.map(type => {
            const Icon = type.icon;

            return (
              <div
                key={type.id}
                className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
                onClick={() => {
                  onAddNode(type.id as NodeType);
                  setOpen(false);
                }}
                title={type.description}
              >
                <Icon
                  className={`mr-2 h-4 w-4 ${type.className || 'text-gray-600'}`}
                />
                <span className={type.className}>{type.label}</span>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
