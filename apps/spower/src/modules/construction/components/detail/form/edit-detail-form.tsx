import { api } from 'portal-api';
import { number, object, string } from 'yup';

import { type FC, useCallback } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import {
  Form,
  NumericField,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

const schema = object().shape({
  level: string().required('Hãy nhập ID'),
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number()
    .transform((_, originalValue) =>
      Number(originalValue.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số')
});

export type EditDetailFormProps = BusinessFormProps & {
  detailId: string;
};

export const EditDetailForm: FC<EditDetailFormProps> = props => {
  const detailById = api.detail.byId.useSuspenseQuery({
    variables: props.detailId
  });

  const updateDetail = api.detail.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa hạng mục công việc thành công');
      props.onSuccess?.();
    }
  });

  const handleFormSuccess = useCallback(
    (values: {
      title?: string;
      volume?: number;
      unit?: string;
      unitPrice?: number;
      level?: string;
    }) => {
      updateDetail.mutate({
        id: props.detailId,
        title: values.title,
        volume: values.volume,
        unit: values.unit,
        unit_price: values.unitPrice,
        level: values.level
      });
    },
    [props.detailId, updateDetail]
  );

  return (
    <Form
      schema={schema}
      onSuccess={handleFormSuccess}
      onCancel={props.onCancel}
      defaultValues={detailById.data}
      loading={updateDetail.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'level'}
        title={'ID (Mã công việc)'}
        options={{}}
      />
      <TextareaField
        schema={schema}
        name={'title'}
        title={'Mô tả công việc'}
        options={{}}
      />
      <NumericField
        schema={schema}
        name={'volume'}
        title={'Khối lượng hợp đồng'}
        options={{}}
      />
      <TextField schema={schema} name={'unit'} title={'Đơn vị'} options={{}} />
      <NumericField
        schema={schema}
        name={'unitPrice'}
        title={'Đơn giá thầu'}
        options={{}}
      />
    </Form>
  );
};
