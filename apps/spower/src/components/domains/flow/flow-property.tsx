import { yupResolver } from '@hookform/resolvers/yup';
import { Trash2 } from 'lucide-react';
import * as yup from 'yup';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Show } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

import type { Flow, FlowType } from '.';
import { SelectFlowType } from './select-flow-type';

type FlowFormValues = {
  id: string;
  action: string;
  type: FlowType;
};

const schema = yup
  .object({
    id: yup.string().required('ID flow là bắt buộc'),
    action: yup.string().default(''),
    type: yup
      .string()
      .oneOf(['default', 'straight', 'step', 'smoothstep'])
      .required('Kiểu đường là bắt buộc')
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
      type: 'smoothstep'
    }
  });

  useEffect(() => {
    if (selectedFlow) {
      reset(
        {
          id: selectedFlow.id,
          action: selectedFlow.action ?? '',
          type: selectedFlow.type ?? 'smoothstep'
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
      if (dirtyKeys.includes('type')) updates.type = values.type;

      onFlowUpdate?.(selectedFlow.id, updates);

      reset(values, {
        keepValues: true
      });
    }
  };

  return (
    <div className="flex max-h-0 flex-col">
      <div className="flex-1">
        <div className="space-y-4 p-4">
          {selectedFlow ? (
            <div className="space-y-4">
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
                <SelectFlowType
                  value={watch('type')}
                  onChange={value => {
                    setValue('type', value as FlowType, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true
                    });

                    handleSubmit(onSubmit)();
                  }}
                />
                {errors.type && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.type.message}
                  </p>
                )}
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
