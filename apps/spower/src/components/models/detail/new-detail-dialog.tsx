import React, { FC } from 'react';

import { DetailInfoResponse, DialogProps, Show } from '@storeo/core';
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

const Content: FC<NewDetailDialogProps> = ({ setOpen, projectId, parent }) => {
  const createDetail = useCreateDetail(projectId, parent?.group, () =>
    setOpen(false)
  );

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Tạo mô tả công việc</DialogTitle>
        <DialogDescription className={'italic'}>
          <Show when={parent} fallback={'Tạo đầu mục mô tả công việc chính'}>
            <>
              <span
                className={'inline font-bold'}
              >{`Mục cha: ${parent?.level}`}</span>
              {`(${parent?.title})`}
            </>
          </Show>
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
        <TextField
          schema={CreateDetailSchema}
          name={'level'}
          title={'ID (Mã công việc)'}
          options={{}}
        />
        <TextareaField
          schema={CreateDetailSchema}
          name={'title'}
          title={'Mô tả công việc'}
          options={{}}
        />
        {parent ? (
          <>
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
          </>
        ) : null}
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
};

export type NewDetailDialogProps = DialogProps & {
  projectId: string;
  parent?: TreeData<DetailInfoResponse>;
};

export const NewDetailDialog: FC<NewDetailDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
