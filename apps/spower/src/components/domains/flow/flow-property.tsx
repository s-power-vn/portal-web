import { yupResolver } from '@hookform/resolvers/yup';
import { Trash2 } from 'lucide-react';
import * as yup from 'yup';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Show } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

import type { Flow, FlowType } from '.';
import { SelectEmployee } from '../employee';

type FlowFormValues = {
  id: string;
  action: string;
  approver: string[];
  type: FlowType;
};

const schema = yup
  .object({
    id: yup.string().required('ID flow là bắt buộc'),
    action: yup.string().default(''),
    approver: yup.array().of(yup.string().defined()).default([]),
    type: yup
      .string()
      .oneOf(['default', 'straight', 'step', 'smoothstep'])
      .default('smoothstep')
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
    watch,
    setValue,
    formState: { errors, dirtyFields }
  } = useForm<FlowFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      id: '',
      action: '',
      approver: [],
      type: 'smoothstep'
    }
  });

  useEffect(() => {
    if (selectedFlow) {
      reset(
        {
          id: selectedFlow.id,
          action: selectedFlow.action ?? '',
          approver: selectedFlow.approver ?? [],
          type: selectedFlow.type ?? 'smoothstep'
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
          approver: [],
          type: 'smoothstep'
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
      if (dirtyKeys.includes('approver')) updates.approver = values.approver;
      if (dirtyKeys.includes('type')) updates.type = values.type;

      onFlowUpdate?.(selectedFlow.id, updates);

      reset(values, {
        keepValues: true
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {selectedFlow ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">ID</label>
                <div className="border-input bg-secondary/20 flex h-10 items-center rounded-md border px-3 py-2 text-sm">
                  {watch('id')}
                </div>
                {errors.id && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.id.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Hành động</label>
                <textarea
                  {...register('action', {
                    onBlur: () => handleSubmit(onSubmit)()
                  })}
                  placeholder="Nhập hành động"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.action && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.action.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Kiểu đường</label>
                <select
                  {...register('type', {
                    onChange: () => handleSubmit(onSubmit)()
                  })}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="default">Mặc định</option>
                  <option value="straight">Thẳng</option>
                  <option value="step">Bậc thang</option>
                  <option value="smoothstep">Bậc thang mượt</option>
                </select>
                {errors.type && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.type.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Người phê duyệt</label>
                <SelectEmployee
                  multiple={true}
                  value={watch('approver')}
                  onChange={value => {
                    const newValue = Array.isArray(value)
                      ? value
                      : [value].filter(Boolean);

                    setValue('approver', newValue, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true
                    });

                    handleSubmit(onSubmit)();
                  }}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-center text-sm">
              Chọn một flow để xem thông tin
            </div>
          )}
        </div>
      </div>
      <Show when={selectedFlow}>
        <div className="border-border bg-background sticky flex h-[70px] shrink-0 items-center justify-between border-t p-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => selectedFlow && onFlowDelete?.(selectedFlow.id)}
          >
            <Trash2 size={16} className="mr-1" />
            Xóa quy trình
          </Button>
        </div>
      </Show>
    </div>
  );
};
