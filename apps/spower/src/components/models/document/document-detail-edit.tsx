import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import PocketBase from 'pocketbase';
import { number, object, string } from 'yup';

import React, { Dispatch, FC, SetStateAction } from 'react';

import {
  DocumentDetailRecord,
  DocumentDetailResponse,
  usePb
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
      Number(originalValue.toString().replace(/,/g, '.'))
    )
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number().typeError('Sai định dạng số')
});

function getDocumentDetail(documentDetailId?: string, pb?: PocketBase) {
  return documentDetailId
    ? pb
        ?.collection<DocumentDetailResponse>('documentDetail')
        .getOne(documentDetailId)
    : null;
}

export function documentDetailOptions(
  documentDetailId?: string,
  pb?: PocketBase
) {
  return queryOptions({
    queryKey: ['documentDetail', documentDetailId],
    queryFn: () => getDocumentDetail(documentDetailId, pb)
  });
}

export type DocumentDetailEditProps = {
  documentId: string;
  documentDetailId?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DocumentDetailEdit: FC<DocumentDetailEditProps> = ({
  documentId,
  documentDetailId,
  open,
  setOpen
}) => {
  const pb = usePb();
  const queryClient = useQueryClient();

  const documentDetailQuery = useSuspenseQuery(
    documentDetailOptions(documentDetailId, pb)
  );

  const updateDocumentDetail = useMutation({
    mutationKey: ['updateDocumentDetail'],
    mutationFn: (params: DocumentDetailRecord) =>
      pb
        .collection<DocumentDetailRecord>('documentDetail')
        .update(documentDetailId ?? '', params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['documentDetails', documentId]
        }),
        queryClient.invalidateQueries({
          queryKey: ['documentDetail', documentDetailId]
        })
      ]),
    onSettled: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              document: documentId,
              ...values
            })
          }
          defaultValues={documentDetailQuery.data ?? undefined}
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
    </Dialog>
  );
};
