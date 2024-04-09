import React, { FC } from 'react';

import { DetailInfoResponse, DialogProps } from '@storeo/core';
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

import { CreateDetailSchema, useCreateDetail } from '../../../api';
import { TreeData } from '../../../commons/utils';

const Content: FC<NewDetailDialogProps> = ({ setOpen, documentId, parent }) => {
  const createDetail = useCreateDetail(documentId, parent?.id, () =>
    setOpen(false)
  );

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Tạo mô tả công việc</DialogTitle>
        <DialogDescription className={'italic'}>
          {parent ? (
            <>
              <span
                className={'inline font-bold'}
              >{`Mục cha: ${parent.level} `}</span>
              {` (${parent.title})`}
            </>
          ) : (
            'Tạo đầu mục mô tả công việc chính'
          )}
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={CreateDetailSchema}
        onSubmit={values => createDetail.mutate(values)}
        defaultValues={{
          title: '',
          volume: undefined,
          unit: '',
          unitPrice: undefined
        }}
        loading={createDetail.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextareaField
          schema={CreateDetailSchema}
          name={'title'}
          title={'Mô tả công việc'}
          options={{}}
        />
        <NumericField
          schema={CreateDetailSchema}
          name={'volume'}
          title={'Khối lượng thầu'}
          options={{}}
        />
        <TextField
          schema={CreateDetailSchema}
          name={'unit'}
          title={'Đơn vị'}
          options={{}}
        />
        <NumericField
          schema={CreateDetailSchema}
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

export type NewDetailDialogProps = DialogProps & {
  documentId: string;
  parent?: TreeData<DetailInfoResponse>;
};

export const NewDetailDialog: FC<NewDetailDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
