import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { number, object, string } from 'yup';

import React, { FC } from 'react';

import {
  DialogProps,
  DocumentDetailData,
  DocumentDetailMaxResponse,
  DocumentDetailRecord,
  client
} from '@storeo/core';
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

const Content: FC<Omit<NewDocumentDetailDialogProps, 'open'>> = ({
  setOpen,
  documentId,
  parent
}) => {
  const queryClient = useQueryClient();

  const createDocumentDetail = useMutation({
    mutationKey: ['createDocumentDetail'],
    mutationFn: async (params: DocumentDetailRecord) => {
      const maxInfo = await client
        .collection<DocumentDetailMaxResponse>('documentDetailMax')
        .getOne(parent ? parent.original.id : 'root');
      return await client
        .collection<DocumentDetailRecord>('documentDetail')
        .create({
          ...params,
          index: (maxInfo.maxIndex as number) + 1
        });
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getDocumentDetails', documentId]
        })
      ]),
    onSettled: () => setOpen(false)
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
              >{`Mục cha: ${parent.original.level} `}</span>
              {` (${parent.original.title})`}
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
            parent: parent ? parent.original.id : 'root',
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

export type NewDocumentDetailDialogProps = DialogProps & {
  documentId: string;
  parent?: Row<DocumentDetailData>;
};

export const NewDocumentDetailDialog: FC<NewDocumentDetailDialogProps> = ({
  documentId,
  open,
  setOpen,
  parent
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Content setOpen={setOpen} documentId={documentId} parent={parent} />
    </Dialog>
  );
};
