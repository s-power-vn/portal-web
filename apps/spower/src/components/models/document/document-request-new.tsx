import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferType, array, boolean, number, object, string } from 'yup';

import { Dispatch, FC, SetStateAction } from 'react';

import { usePb } from '@storeo/core';
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

import { DocumentPickField } from './document-pick-field';

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
            console.log(hasChild);
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

export type DocumentRequestNewProps = {
  documentId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DocumentRequestNew: FC<DocumentRequestNewProps> = ({
  documentId,
  open,
  setOpen
}) => {
  const pb = usePb();
  const queryClient = useQueryClient();

  const createDocumentRequest = useMutation({
    mutationKey: ['createDocumentRequest'],
    mutationFn: async (params: InferType<typeof schema>) => {
      const record = await pb.collection('documentRequest').create({
        document: documentId,
        name: params.name
      });

      return await Promise.all(
        params.documents.map(it => {
          return pb.collection('documentRequestDetail').create(
            {
              documentRequest: record.id,
              documentDetail: it.id,
              volume: it.requestVolume
            },
            {
              requestKey: null
            }
          );
        })
      );
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['documentRequests', documentId]
        })
      ]),
    onSettled: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex min-w-[800px] flex-col">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu mua hàng</DialogTitle>
          <DialogDescription className={'italic'}>
            Tạo yêu cầu mua hàng mới. Cho phép chọn từ danh sách hạng mục
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          defaultValues={{
            name: ''
          }}
          className={'mt-4 flex flex-col gap-3'}
          loading={createDocumentRequest.isPending}
          onSubmit={values => createDocumentRequest.mutate(values)}
        >
          <TextareaField schema={schema} name={'name'} title={'Nội dung'} />
          <DocumentPickField
            schema={schema}
            name={'documents'}
            options={{ documentId }}
          />
          <DialogFooter className={'mt-4'}>
            <Button type="submit">Chấp nhận</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
