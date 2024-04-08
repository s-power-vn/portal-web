import { useQueryClient } from '@tanstack/react-query';
import { number, object, string } from 'yup';

import React, { FC } from 'react';

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
  TextareaField
} from '@storeo/theme';

import {
  DetailData,
  getAllDetailsByDocumentIdKey,
  useUpdateDetail
} from '../../../api';

const schema = object().shape({
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number().typeError('Sai định dạng số')
});

const Content: FC<EditDetailDialogProps> = ({ setOpen, detail }) => {
  const queryClient = useQueryClient();

  const updateDocumentDetail = useUpdateDetail(detail.id, async () => {
    setOpen(false);
    await queryClient.invalidateQueries({
      queryKey: getAllDetailsByDocumentIdKey(detail.document)
    });
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
          updateDocumentDetail.mutate({
            document: detail.document,
            ...values
          })
        }
        defaultValues={detail}
        loading={updateDocumentDetail.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextareaField
          schema={schema}
          name={'title'}
          title={'Mô tả công việc'}
          options={{}}
        />
        <NumericField
          schema={schema}
          name={'volume'}
          title={'Khối lượng thầu'}
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
  detail: DetailData;
};

export const EditDetailDialog: FC<EditDetailDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
