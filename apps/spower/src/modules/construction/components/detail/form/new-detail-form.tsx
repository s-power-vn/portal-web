import { TreeData } from 'portal-core';
import { number, object, string } from 'yup';

import { type FC, useCallback } from 'react';

import { Show } from '@minhdtb/storeo-core';
import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import {
  Form,
  NumericField,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

import { DetailListItem, detailApi } from '../../../api';

const schema = object().shape({
  level: string().required('Hãy nhập ID'),
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) => {
      if (originalValue === '' || Number.isNaN(originalValue)) {
        return undefined;
      }
      return Number(originalValue?.toString().replace(/,/g, '.'));
    })
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number()
    .transform((_, originalValue) => {
      if (originalValue === '' || Number.isNaN(originalValue)) {
        return undefined;
      }
      return Number(originalValue?.toString().replace(/,/g, '.'));
    })
    .typeError('Sai định dạng số')
});

export type NewDetailFormProps = BusinessFormProps & {
  projectId: string;
  parent?: TreeData<DetailListItem>;
};

export const NewDetailForm: FC<NewDetailFormProps> = props => {
  const createDetail = detailApi.create.useMutation({
    onSuccess: async () => {
      success('Tạo hạng mục công việc thành công');
      props.onSuccess?.();
    }
  });

  const handleFormSuccess = useCallback(
    (values: {
      level?: string;
      title?: string;
      volume?: number;
      unit?: string;
      unitPrice?: number;
    }) => {
      createDetail.mutate({
        parent_id: props.parent?.id,
        title: values.title ?? '',
        level: values.level ?? '',
        volume: values.volume ?? 0,
        unit: values.unit ?? '',
        unit_price: values.unitPrice ?? 0
      });
    },
    [props.parent?.id, createDetail]
  );

  return (
    <Form
      schema={schema}
      onSuccess={handleFormSuccess}
      defaultValues={{
        level: '',
        title: '',
        unit: '',
        unitPrice: 0
      }}
      onCancel={props.onCancel}
      loading={createDetail.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField schema={schema} name={'level'} title={'ID (Mã công việc)'} />
      <TextareaField schema={schema} name={'title'} title={'Mô tả công việc'} />
      <Show when={props.parent}>
        <NumericField
          schema={schema}
          name={'volume'}
          title={'Khối lượng thầu'}
        />
        <TextField schema={schema} name={'unit'} title={'Đơn vị'} />
        <NumericField
          schema={schema}
          name={'unitPrice'}
          title={'Đơn giá thầu'}
        />
      </Show>
    </Form>
  );
};
