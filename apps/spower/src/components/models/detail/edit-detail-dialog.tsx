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
  TextareaField
} from '@storeo/theme';

import {
  CreateDetailSchema,
  UpdateDetailSchema,
  useGetDetailById,
  useUpdateDetail
} from '../../../api';

const Content: FC<EditDetailDialogProps> = ({ setOpen, detailId }) => {
  const detail = useGetDetailById(detailId);

  const updateDetail = useUpdateDetail(detailId, () => setOpen(false));

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
        onSubmit={values => updateDetail.mutate(values)}
        defaultValues={detail.data}
        loading={updateDetail.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={CreateDetailSchema}
          name={'level'}
          title={'ID (Mã công việc)'}
          options={{}}
        />
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
