import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowDownToLineIcon,
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ArrowUpToLineIcon,
  Plus,
  Trash2
} from 'lucide-react';
import * as yup from 'yup';

import { FC, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@minhdtb/storeo-theme';

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
    control,
    formState: { errors }
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
      const { id, ...updates } = values;
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

  const { replace } = useFieldArray({
    control,
    name: 'points'
  });

  const removePoint = (index: number) => {
    const newPoints = [...points];
    const nodeId = selectedNode?.id;

    if (nodeId) {
      if (newPoints.length === 1) {
        replace([]);
        handleSubmit(onSubmit)();
      } else {
        newPoints.splice(index, 1);
        setValue('points', newPoints, { shouldDirty: true });
        handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-130px)] flex-col">
      <div className="min-h-0 flex-1">
        <div className="h-full overflow-y-auto">
          <div className="space-y-4 p-4">
            {selectedNode ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div>
                  <label className="text-sm font-medium">
                    Tên nút
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name', {
                      onBlur: () => handleSubmit(onSubmit)()
                    })}
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
                    {...register('description', {
                      onBlur: () => handleSubmit(onSubmit)()
                    })}
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
                    {...register('condition', {
                      onBlur: () => handleSubmit(onSubmit)()
                    })}
                    placeholder="Nhập điều kiện"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.condition && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-end justify-between">
                    <label className="text-sm font-medium">Điểm nối</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPoint}
                      className="mb-2 h-8"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Thêm điểm nối
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {points?.map((point, index) => (
                      <div key={point.id} className="flex items-center gap-2">
                        <Select
                          value={point.type}
                          onValueChange={(
                            value: 'top' | 'bottom' | 'right' | 'left'
                          ) => {
                            const newPoints = [...points];
                            newPoints[index] = { ...point, type: value };
                            setValue('points', newPoints, {
                              shouldDirty: true
                            });
                            handleSubmit(onSubmit)();
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vị trí" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">
                              <div className="flex items-center gap-2">
                                <ArrowUpToLineIcon className="h-4 w-4" />
                                Trên
                              </div>
                            </SelectItem>
                            <SelectItem value="bottom">
                              <div className="flex items-center gap-2">
                                <ArrowDownToLineIcon className="h-4 w-4" />
                                Dưới
                              </div>
                            </SelectItem>
                            <SelectItem value="right">
                              <div className="flex items-center gap-2">
                                <ArrowRightToLineIcon className="h-4 w-4" />
                                Phải
                              </div>
                            </SelectItem>
                            <SelectItem value="left">
                              <div className="flex items-center gap-2">
                                <ArrowLeftToLineIcon className="h-4 w-4" />
                                Trái
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
        </div>
      </div>
      <div className="border-border bg-background sticky flex h-[70px] shrink-0 items-center justify-between border-t p-4">
        <Button
          type="button"
          variant="destructive"
          onClick={() => selectedNode && onNodeDelete?.(selectedNode.id)}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
};
