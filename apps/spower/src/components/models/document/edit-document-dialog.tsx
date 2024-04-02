import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import PocketBase from 'pocketbase';
import { object, string } from 'yup';

import { Dispatch, FC, SetStateAction } from 'react';

import {
  DocumentRecord,
  DocumentResponse,
  DocumentStatusOptions,
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
  TextField
} from '@storeo/theme';

import { CustomerDropdownField } from '../customer/customer-dropdown-field';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

function getDocument(id?: string, pb?: PocketBase) {
  return id ? pb?.collection<DocumentResponse>('document').getOne(id) : null;
}

function documentOptions(id?: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['document', id],
    queryFn: () => getDocument(id, pb),
    enabled: !!id
  });
}

export type DocumentEditProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  documentId?: string;
};

export const EditDocumentDialog: FC<DocumentEditProps> = ({
  open,
  setOpen,
  documentId
}) => {
  const pb = usePb();
  const queryClient = useQueryClient();

  const documentQuery = useSuspenseQuery(documentOptions(documentId, pb));

  const updateDocument = useMutation({
    mutationKey: ['updateDocument'],
    mutationFn: (params: DocumentRecord) =>
      pb.collection('document').update(documentId ?? '', params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
        queryClient.invalidateQueries({ queryKey: ['document', documentId] })
      ]),
    onSettled: () => {
      setOpen(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
          <DialogDescription className={'italic'}>
            Chỉnh sửa thông tin chung của tài liệu thi công.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values =>
            updateDocument.mutate({
              ...values,
              status: DocumentStatusOptions.ToDo,
              createdBy: pb.authStore.model?.id
            })
          }
          defaultValues={documentQuery.data ?? undefined}
          loading={updateDocument.isPending}
          className={'mt-4 flex flex-col gap-3'}
        >
          <TextField
            schema={schema}
            name={'bidding'}
            title={'Tên gói thầu'}
            options={{}}
          />
          <TextField
            schema={schema}
            name={'name'}
            title={'Tên công trình'}
            options={{}}
          />
          <CustomerDropdownField
            schema={schema}
            name={'customer'}
            title={'Chủ đầu tư'}
            options={{
              placeholder: 'Hãy chọn chủ đầu tư'
            }}
          />
          <DialogFooter className={'mt-4'}>
            <Button type="submit">Chấp nhận</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
