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
  NumericField,
  TextField
} from '@storeo/theme';

import { DocumentDetailData } from './DocumentOverview';

const schema = object().shape({
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number().typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number().typeError('Sai định dạng số')
});

export type DocumentDetailNewProps = {
  documentId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  parent?: Row<DocumentDetailData>;
};

export const DocumentDetailNew: FC<DocumentDetailNewProps> = ({
  documentId,
  open,
  setOpen,
  parent
}) => {
  const pb = usePb();
  const queryClient = useQueryClient();

  const createDocumentDetail = useMutation({
    mutationKey: ['createDocumentDetail'],
    mutationFn: (params: DocumentDetailRecord) =>
      pb.collection<DocumentDetailRecord>('documentDetail').create(params),
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
          <DialogTitle>Tạo mô tả công việc</DialogTitle>
          <DialogDescription className={'italic'}>
            {parent ? (
              <>
                <span
                  className={'inline font-bold'}
                >{`Mục cha: ${parent.id} `}</span>
                {` (${parent.original.title})`}
              </>
            ) : (
              'Tạo đầu mục mô tả công việc'
            )}
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values =>
            createDocumentDetail.mutate({
              document: documentId,
              parent: parent?.original.id,
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
          <TextField
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
    </Dialog>
  );
};
