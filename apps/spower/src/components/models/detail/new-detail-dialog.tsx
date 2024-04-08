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

import { DetailData, getAllDetailsKey, useCreateDetail } from '../../../api';

const schema = object().shape({
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number()
    .transform((_, originalValue) =>
      Number(originalValue.toString().replace(/,/g, '.'))
    )
    .typeError('Sai định dạng số')
});

const Content: FC<NewDetailDialogProps> = ({ setOpen, documentId, parent }) => {
  const queryClient = useQueryClient();

  const createDocumentDetail = useCreateDetail(async () => {
    setOpen(false);
    await queryClient.invalidateQueries({
      queryKey: getAllDetailsKey(documentId)
    });
  });

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
        schema={schema}
        onSubmit={values =>
          createDocumentDetail.mutate({
            document: documentId,
            parent: parent ? parent.id : 'root',
            ...values
          })
        }
        defaultValues={{
          title: '',
          volume: undefined,
          unit: '',
          unitPrice: undefined
        }}
        loading={createDocumentDetail.isPending}
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

export type NewDetailDialogProps = DialogProps & {
  documentId: string;
  parent?: DetailData;
};

export const NewDetailDialog: FC<NewDetailDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
