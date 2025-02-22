import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Show } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

import type { Flow } from '.';

type FlowFormValues = {
  id: string;
  action: string;
  approve: boolean;
};

const schema = yup
  .object({
    id: yup.string().required('ID flow là bắt buộc'),
    action: yup.string().default(''),
    approve: yup.boolean().default(false)
  })
  .required();

export type FlowPropertyProps = {
  selectedFlow: Flow | null;
  onFlowUpdate?: (flowId: string, updates: Partial<Flow>) => void;
  onFlowDelete?: (flowId: string) => void;
};

export const FlowProperty: FC<FlowPropertyProps> = ({
  selectedFlow,
  onFlowUpdate,
  onFlowDelete
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors, dirtyFields }
  } = useForm<FlowFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      id: '',
      action: '',
      approve: false
    }
  });

  useEffect(() => {
    if (selectedFlow) {
      reset(
        {
          id: selectedFlow.id,
          action: selectedFlow.action ?? '',
          approve: selectedFlow.approve ?? false
        },
        {
          keepDefaultValues: false
        }
      );
    } else {
      reset(
        {
          id: '',
          action: '',
          approve: false
        },
        {
          keepDefaultValues: false
        }
      );
    }
  }, [selectedFlow, reset]);

  const onSubmit = (values: FlowFormValues) => {
    if (selectedFlow) {
      const updates: Partial<Flow> = {};
      const dirtyKeys = Object.keys(dirtyFields) as Array<keyof FlowFormValues>;

      if (dirtyKeys.includes('action')) updates.action = values.action;
      if (dirtyKeys.includes('approve')) updates.approve = values.approve;

      onFlowUpdate?.(selectedFlow.id, updates);

      reset(values, {
        keepValues: true
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="overflow-y-auto p-4">
        {selectedFlow ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                ID
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                {...register('id')}
                placeholder="Nhập ID flow"
                disabled
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.id && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.id.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Hành động</label>
              <textarea
                {...register('action')}
                placeholder="Nhập hành động"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.action && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.action.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('approve')}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring h-4 w-4 rounded border focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <label className="text-sm font-medium">Yêu cầu phê duyệt</label>
            </div>
          </form>
        ) : (
          <div className="text-muted-foreground text-center text-sm">
            Chọn một flow để xem thông tin
          </div>
        )}
      </div>
      <Show when={selectedFlow}>
        <div className="border-border flex items-center justify-between border-t p-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => selectedFlow && onFlowDelete?.(selectedFlow.id)}
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
