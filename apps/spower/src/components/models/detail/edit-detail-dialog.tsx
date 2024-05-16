import { useQueryClient } from '@tanstack/react-query';
import { number, object, string } from 'yup';

import React, { FC, Suspense } from 'react';

import { DialogProps } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  NumericField,
  TextField,
  TextareaField,
  success
} from '@storeo/theme';

import { detailApi, detailInfoApi } from '../../../api';

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

const Content: FC<EditDetailDialogProps> = ({ setOpen, detailId }) => {
  const queryClient = useQueryClient();
  const detailById = detailApi.byId.useSuspenseQuery({
    variables: detailId
  });

  const updateDetail = detailApi.update.useMutation({
    onSuccess: async record => {
      success('Chỉnh sửa hạng mục công việc thành công');
      setOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailApi.listFull.getKey(record.project)
        }),
        queryClient.invalidateQueries({
          queryKey: detailInfoApi.listFull.getKey(record.project)
        }),
        queryClient.invalidateQueries({
          queryKey: detailApi.byId.getKey(detailId)
        })
      ]);
    }
  });

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Sửa mô tả công việc</DialogTitle>
        <DialogDescription className={'italic'}>
          Chỉnh sửa chi tiết mô tả công việc
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={schema}
        onSubmit={values =>
          updateDetail.mutate({
            ...values,
            id: detailId
          })
        }
        defaultValues={detailById.data}
        loading={updateDetail.isPending}
        className={'mt-4 flex flex-col gap-3'}
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
        <TextField
          schema={schema}
          name={'unit'}
          title={'Đơn vị'}
          options={{}}
        />
        <NumericField
          schema={schema}
          name={'unitPrice'}
          title={'Đơn giá thầu'}
          options={{}}
        />
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
};

export type EditDetailDialogProps = DialogProps & {
  detailId: string;
};

export const EditDetailDialog: FC<EditDetailDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Suspense>
        <Content {...props} />
      </Suspense>
    </Dialog>
  );
};
