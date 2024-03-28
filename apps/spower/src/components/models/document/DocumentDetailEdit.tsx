import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { number, object, string } from 'yup';

import React, { Dispatch, FC, SetStateAction } from 'react';

import { DocumentDetailRecord, usePb } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  TextField
} from '@storeo/theme';

import { DocumentDetailData } from './DocumentOverview';

const schema = object().shape({
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number().typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number().typeError('Sai định dạng số')
});

export type DocumentDetailEditProps = {
  documentId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  parent?: Row<DocumentDetailData>;
};

export const DocumentDetailEdit: FC<DocumentDetailEditProps> = ({
  documentId,
  open,
  setOpen,
  parent
}) => {
  const pb = usePb();
  const queryClient = useQueryClient();

  const updateDocumentDetail = useMutation({
    mutationKey: ['updateDocumentDetail'],
    mutationFn: (params: DocumentDetailRecord) =>
      pb
        .collection<DocumentDetailRecord>('documentDetail')
        .update(parent?.original.id ?? '', params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['documentDetails', documentId]
        })
      ]),
    onSettled: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-1/4">
        <DialogHeader>
          <DialogTitle>Sửa mô tả công việc</DialogTitle>
          <DialogDescription className={'italic'}>
            Sửa mô tả công việc
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values =>
            updateDocumentDetail.mutate({
              document: documentId,
              parent: parent?.id,
              ...values
            })
          }
          defaultValues={parent?.original ?? {}}
          loading={updateDocumentDetail.isPending}
          className={'mt-4 flex flex-col gap-3'}
        >
          <TextField
            schema={schema}
            name={'title'}
            title={'Mô tả công việc'}
            options={{}}
          />
          <TextField
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
          <TextField
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
    </Dialog>
  );
};
