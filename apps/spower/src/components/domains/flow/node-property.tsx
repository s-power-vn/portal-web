import { yupResolver } from '@hookform/resolvers/yup';
import { uuidv7 } from '@kripod/uuidv7';
import {
  ArrowDownToLineIcon,
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ArrowUpToLineIcon,
  Edit,
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
  SelectValue,
  showModal
} from '@minhdtb/storeo-theme';

import { ConditionDisplay } from './condition-display';
import { ConditionGenerator } from './condition-generator';
import type { Node, NodeType, OperationType, Point, PointRole } from './types';

type NodeFormValues = {
  id: string;
  name: string;
  description: string;
  type: NodeType;
  operationType: OperationType;
  points: Point[];
  condition: string;
};

const schema = yup
  .object({
    id: yup.string().required(),
    name: yup.string().required('Tên node là bắt buộc'),
    description: yup.string().default(''),
    type: yup.string().oneOf(['start', 'finished', 'normal']).default('normal'),
    operationType: yup.string().oneOf(['auto', 'manual']).default('manual'),
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
      .default([]),
    condition: yup.string().default('')
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
      type: 'normal',
      operationType: 'manual',
      points: [],
      condition: ''
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
        type: rest.type,
        operationType: rest.operationType,
        points: Array.isArray(rest.points) ? rest.points : [],
        condition: rest.condition || ''
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
    const uniqueId = uuidv7().replace(/-/g, '');
    const newId = `p_${uniqueId}`;
    newPoints.push({ id: newId, type: 'right' });
    setValue('points', newPoints, { shouldDirty: true });
    handleSubmit(onSubmit)();
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

  const handleShowConditionGenerator = () => {
    showModal({
      title: 'Tạo điều kiện',
      children: ({ close }) => {
        return (
          <ConditionGenerator
            value={watch('condition')}
            onChange={value => {
              setValue('condition', value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
              });
              handleSubmit(onSubmit)();
              close();
            }}
          />
        );
      }
    });
  };

  return (
    <div className="flex max-h-0 flex-col">
      <div className="flex-1">
        <div className="space-y-4 p-4">
          {selectedNode ? (
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">ID</label>
                <div className="border-input bg-appGrayLight flex h-10 w-full items-center rounded-md border px-3 py-2 text-sm">
                  <div className="w-full truncate">{watch('id')}</div>
                </div>
                {errors.id && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.id.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">
                  Tên nút
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  onBlur={() => handleSubmit(onSubmit)()}
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
                  onBlur={() => handleSubmit(onSubmit)()}
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
                <div className="flex flex-col gap-2">
                  {watch('condition') ? (
                    <div className="rounded-md border p-2">
                      <ConditionDisplay condition={watch('condition')} />
                    </div>
                  ) : (
                    <div className="rounded-md border p-2 text-sm text-gray-500">
                      Không có điều kiện
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={handleShowConditionGenerator}
                    >
                      <Edit size={16} className="mr-1" />
                      {watch('condition') ? 'Sửa điều kiện' : 'Tạo điều kiện'}
                    </Button>
                    {watch('condition') && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          setValue('condition', '', {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true
                          });
                          handleSubmit(onSubmit)();
                        }}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Xóa điều kiện
                      </Button>
                    )}
                  </div>
                </div>
                {errors.condition && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.condition.message}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <div className="flex items-end justify-between">
                  <label className="text-sm font-medium">Điểm nối</label>
                  {(watch('type') === 'normal' || points.length < 2) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPoint}
                      className="mb-2 h-8"
                      disabled={
                        watch('type') !== 'normal' && points.length >= 2
                      }
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Thêm điểm nối
                    </Button>
                  )}
                </div>
                {watch('type') !== 'normal' && (
                  <div className="mb-2 text-xs text-gray-500">
                    Tối đa 2 điểm nối cho nút{' '}
                    {watch('type') === 'start' ? 'bắt đầu' : 'hoàn thành'}
                  </div>
                )}
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
                        disabled={
                          watch('type') !== 'normal' && points.length <= 1
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-center text-sm">
              Chọn một node để xem thông tin
            </div>
          )}
        </div>
      </div>
      <div className="border-border bg-background flex items-center justify-between border-t p-4">
        <Button
          type="button"
          variant="destructive"
          onClick={() => selectedNode && onNodeDelete?.(selectedNode.id)}
        >
          <Trash2 size={16} className="mr-1" />
          Xóa nút
        </Button>
      </div>
    </div>
  );
};
