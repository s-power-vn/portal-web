import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { InferType, array, boolean, number, object, string } from 'yup';

import { Dispatch, FC, SetStateAction, useMemo } from 'react';

import {
  DocumentRequestDetailRecord,
  DocumentRequestRecord,
  arrayToTree,
  client,
  flatTree
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
  TextareaField
} from '@storeo/theme';

import { DocumentRequestDetailListField } from '../document-request-detail/document-request-detail-list-field';
import { getDocumentRequestOptions } from './document-request-item';

const schema = object().shape({
  name: string().required('Hãy nhập nội dung'),
  documents: array()
    .of(
      object().shape({
        id: string().optional(),
        hasChild: boolean().optional(),
        requestVolume: number()
          .transform((_, originalValue) =>
            Number(originalValue?.toString().replace(/,/g, '.'))
          )
          .typeError('Hãy nhập khối lượng yêu cầu')
          .when('hasChild', (hasChild, schema) => {
            return hasChild[0]
              ? schema
              : schema
                  .moreThan(0, 'Hãy nhập khối lượng yêu cầu')
                  .required('Hãy nhập khối lượng yêu cầu');
          })
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
    .required('Hãy chọn ít nhất 1 hạng mục')
});

const Content: FC<Omit<EditDocumentRequestDialogProps, 'open'>> = ({
  setOpen,
  documentRequestId
}) => {
  const queryClient = useQueryClient();

  const documentRequestQuery = useQuery(
    getDocumentRequestOptions(documentRequestId)
  );

  const data = useMemo(() => {
    const v = _.chain(
      documentRequestQuery.data
        ? documentRequestQuery.data.expand[
            'documentRequestDetail_via_documentRequest'
          ]
        : []
    )
      .map(it => ({
        ...it.expand.documentDetail,
        id: it.id,
        documentDetailId: it.expand.documentDetail.id,
        requestVolume: it.volume
      }))
      .value();
    return flatTree(arrayToTree(v, 'root', 'documentDetailId'));
  }, [documentRequestQuery.data]);

  const updateDocumentRequest = useMutation({
    mutationKey: ['updateDocumentRequest'],
    mutationFn: async (params: InferType<typeof schema>) => {
      await client
        .collection<DocumentRequestRecord>('documentRequest')
        .update(documentRequestId, {
          name: params.name
        });
      await Promise.all(
        params.documents.map(it => {
          return it.id
            ? client
                .collection<DocumentRequestDetailRecord>(
                  'documentRequestDetail'
                )
                .update(
                  it.id,
                  { volume: it.requestVolume },
                  {
                    requestKey: null
                  }
                )
            : null;
        })
      );
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getDocumentRequest', documentRequestId]
        })
      ]),
    onSettled: () => setOpen(false)
  });

  return (
    <DialogContent className="flex min-w-[800px] flex-col">
      <DialogHeader>
        <DialogTitle>Sửa yêu cầu mua hàng</DialogTitle>
        <DialogDescription className={'italic'}>
          Sửa khối lượng yêu cầu mua hàng
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={schema}
        defaultValues={{
          name: documentRequestQuery.data?.name,
          documents: data
        }}
        className={'mt-4 flex flex-col gap-3'}
        loading={updateDocumentRequest.isPending}
        onSubmit={values => updateDocumentRequest.mutate(values)}
      >
        <TextareaField schema={schema} name={'name'} title={'Nội dung'} />
        <DocumentRequestDetailListField
          schema={schema}
          name={'documents'}
          options={{ documentId: '' }}
        />
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
};

export type EditDocumentRequestDialogProps = {
  documentRequestId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditDocumentRequestDialog: FC<EditDocumentRequestDialogProps> = ({
  documentRequestId,
  open,
  setOpen
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Content documentRequestId={documentRequestId} setOpen={setOpen} />
    </Dialog>
  );
};
