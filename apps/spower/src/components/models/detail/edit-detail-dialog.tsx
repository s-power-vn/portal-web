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

import { DetailData, UpdateDetailSchema, useUpdateDetail } from '../../../api';

const Content: FC<EditDetailDialogProps> = ({ setOpen, detail }) => {
  const updateDocumentDetail = useUpdateDetail(detail.id, async () =>
    setOpen(false)
  );

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Sửa mô tả công việc</DialogTitle>
        <DialogDescription className={'italic'}>
          Chỉnh sửa chi tiết mô tả công việc
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={UpdateDetailSchema}
        onSubmit={values => updateDocumentDetail.mutate(values)}
        defaultValues={detail}
        loading={updateDocumentDetail.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextareaField
          schema={UpdateDetailSchema}
          name={'title'}
          title={'Mô tả công việc'}
          options={{}}
        />
        <NumericField
          schema={UpdateDetailSchema}
          name={'volume'}
          title={'Khối lượng thầu'}
          options={{}}
        />
        <TextField
          schema={UpdateDetailSchema}
          name={'unit'}
          title={'Đơn vị'}
          options={{}}
        />
        <NumericField
          schema={UpdateDetailSchema}
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
