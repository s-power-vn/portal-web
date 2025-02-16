import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, Trash2 } from 'lucide-react';
import * as yup from 'yup';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Show } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

import type { Node, Point, PointRole } from './types';

type NodeFormValues = {
  id: string;
  name: string;
  description: string;
  condition: string;
  points: Point[];
};

const schema = yup
  .object({
    id: yup.string().required(),
    name: yup.string().required('Tên node là bắt buộc'),
    description: yup.string().default(''),
    condition: yup.string().default(''),
    points: yup
      .array()
      .of(
        yup.object({
          id: yup.string().required(),
          type: yup
            .string()
            .oneOf(['top', 'bottom', 'right', 'left'])
            .required('Loại point là bắt buộc'),
          role: yup.mixed<PointRole>().optional()
        })
      )
      .default([])
  })
  .required();

export type NodePropertyProps = {
  selectedNode: Node | null;
  onNodeUpdate?: (nodeId: string, updates: Partial<Node>) => void;
  onNodeDelete?: (nodeId: string) => void;
};

export const NodeProperty: FC<NodePropertyProps> = ({
  selectedNode,
  onNodeUpdate,
  onNodeDelete
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, errors, dirtyFields }
  } = useForm<NodeFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      condition: '',
      points: []
    }
  });

  const points = watch('points');

  useEffect(() => {
    if (selectedNode) {
      const { x, y, ...rest } = selectedNode;
      const formValues: NodeFormValues = {
        id: rest.id,
        name: rest.name,
        description: rest.description || '',
        condition: rest.condition || '',
        points: Array.isArray(rest.points) ? rest.points : []
      };
      reset(formValues);
    }
  }, [selectedNode, reset]);

  const onSubmit = (values: NodeFormValues) => {
    if (selectedNode) {
      console.log('values', values);
      const updates: Partial<Node> = {};
      (Object.keys(dirtyFields) as Array<keyof NodeFormValues>).forEach(key => {
        if (key !== 'id') {
          if (key === 'points') {
            updates.points = values.points;
          } else {
            updates[key as 'name' | 'description' | 'condition'] = values[key];
          }
        }
      });

      onNodeUpdate?.(selectedNode.id, updates);

      reset(values, {
        keepValues: true
      });
    }
  };

  const addPoint = () => {
    const newPoints = [...points];
    const newId = `p${newPoints.length + 1}`;
    newPoints.push({ id: newId, type: 'right' });
    setValue('points', newPoints, { shouldDirty: true });
  };

  const removePoint = (index: number) => {
    const newPoints = [...points];
    const nodeId = selectedNode?.id;

    if (nodeId) {
      newPoints.splice(index, 1);
      setValue('points', newPoints, { shouldDirty: true });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="overflow-y-auto p-4">
        {selectedNode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Tên node
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Nhập tên node"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.name && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Mô tả</label>
              <textarea
                {...register('description')}
                placeholder="Nhập mô tả"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Điều kiện</label>
              <textarea
                {...register('condition')}
                placeholder="Nhập điều kiện"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.condition && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.condition.message}
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">Points</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPoint}
                  className="h-8"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm point
                </Button>
              </div>
              <div className="space-y-2">
                {points.map((point, index) => (
                  <div key={point.id} className="flex items-center gap-2">
                    <select
                      {...register(`points.${index}.type`)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="right">Right</option>
                      <option value="left">Left</option>
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePoint(index)}
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <div className="text-muted-foreground text-center text-sm">
            Chọn một node để xem thông tin
          </div>
        )}
      </div>
      <Show when={selectedNode}>
        <div className="border-border flex items-center justify-between border-t p-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => selectedNode && onNodeDelete?.(selectedNode.id)}
          >
            Xóa
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty}
          >
            Chấp nhận
          </Button>
        </div>
      </Show>
    </div>
  );
};
