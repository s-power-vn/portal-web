import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { number, object, string } from 'yup';

import React, { FC } from 'react';

import {
  DialogProps,
  DocumentDetailRecord,
  DocumentDetailResponse,
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
  unitPrice: number().typeError('Sai định dạng số')
});

export function getDocumentDetailOptions(documentDetailId?: string) {
  return queryOptions({
    queryKey: ['getDocumentDetail', documentDetailId],
    queryFn: async () =>
      documentDetailId
        ? await client
            ?.collection<DocumentDetailResponse>('documentDetail')
            .getOne(documentDetailId)
        : null
  });
}

const Content: FC<Omit<EditDocumentDetailDialogProps, 'open'>> = ({
  setOpen,
  documentId,
  documentDetailId
}) => {
  const queryClient = useQueryClient();

  const documentDetailQuery = useQuery(
    getDocumentDetailOptions(documentDetailId)
  );

  const updateDocumentDetailMutation = useMutation({
    mutationKey: ['updateDocumentDetail'],
    mutationFn: async (params: DocumentDetailRecord) =>
      documentDetailId
        ? await client
            .collection<DocumentDetailResponse>('documentDetail')
            .update(documentDetailId, params)
        : null,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getDocumentDetails', documentId]
        }),
        queryClient.invalidateQueries({
          queryKey: ['getDocumentDetail', documentDetailId]
        })
      ]),
    onSettled: () => setOpen(false)
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
          updateDocumentDetailMutation.mutate({
            document: documentId,
            ...values
          })
        }
        defaultValues={documentDetailQuery.data ?? undefined}
        loading={updateDocumentDetailMutation.isPending}
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

export type EditDocumentDetailDialogProps = DialogProps & {
  documentId: string;
  documentDetailId: string;
};

export const EditDocumentDetailDialog: FC<EditDocumentDetailDialogProps> = ({
  documentId,
  documentDetailId,
  open,
  setOpen
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Content
        setOpen={setOpen}
        documentId={documentId}
        documentDetailId={documentDetailId}
      />
    </Dialog>
  );
};
