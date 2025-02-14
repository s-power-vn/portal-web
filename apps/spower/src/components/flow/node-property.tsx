import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Show } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

import type { Node } from '.';

type NodeFormValues = {
  name: string;
  description: string;
  condition: string;
};

const schema = yup
  .object({
    name: yup.string().required('Tên node là bắt buộc'),
    description: yup.string().default(''),
    condition: yup.string().default('')
  })
  .required();

export type NodePropertyProps = {
  selectedNode: Node | null;
  onNodeUpdate?: (nodeId: string, updates: Partial<Node>) => void;
};

export const NodeProperty: FC<NodePropertyProps> = ({
  selectedNode,
  onNodeUpdate
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors, dirtyFields }
  } = useForm<NodeFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      condition: ''
    }
  });

  useEffect(() => {
    if (selectedNode) {
      reset({
        name: selectedNode.name,
        description: selectedNode.description,
        condition: selectedNode.condition
      });
    }
  }, [selectedNode, reset]);

  const onSubmit = (values: NodeFormValues) => {
    if (selectedNode) {
      const updates: Partial<Node> = {};
      (Object.keys(dirtyFields) as Array<keyof NodeFormValues>).forEach(key => {
        updates[key] = values[key];
      });

      onNodeUpdate?.(selectedNode.id, updates);

      reset(values, {
        keepValues: true
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên node</label>
              <input
                type="text"
                {...register('name')}
                placeholder="Nhập tên node"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <textarea
                {...register('description')}
                placeholder="Nhập mô tả"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description && (
                <p className="text-destructive text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Điều kiện</label>
              <textarea
                {...register('condition')}
                placeholder="Nhập điều kiện"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.condition && (
                <p className="text-destructive text-sm">
                  {errors.condition.message}
                </p>
              )}
            </div>
          </form>
        ) : (
          <div className="text-muted-foreground text-center text-sm">
            Chọn một node để xem thông tin
          </div>
        )}
      </div>
      <Show when={selectedNode}>
        <div className="border-border flex justify-end border-t p-4">
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
