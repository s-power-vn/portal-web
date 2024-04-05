import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { object, string } from 'yup';

import { FC } from 'react';

import { DialogProps, DocumentStatusOptions, client } from '@storeo/core';
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

import {
  DocumentSearch,
  getAllDocumentsKey,
  getMineDocumentsKey,
  getWaitingDocumentsKey,
  useCreateDocument
} from '../../../api';
import { CustomerDropdownField } from '../customer/customer-dropdown-field';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

const Content: FC<DocumentNewProps> = ({ setOpen, search, screen }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const createDocument = useCreateDocument(async () => {
    setOpen(false);
    await queryClient.invalidateQueries({
      queryKey:
        screen === 'all'
          ? getAllDocumentsKey(search)
          : screen === 'wating'
            ? getWaitingDocumentsKey(search)
            : getMineDocumentsKey(search)
    });
    await navigate({
      to: '/document/mine',
      search: {
        pageIndex: 1,
        pageSize: 10,
        filter: ''
      }
    });
  });

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Tạo tài liệu</DialogTitle>
        <DialogDescription className={'italic'}>
          Tạo tài liệu thi công mới.
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={schema}
        onSubmit={values =>
          createDocument.mutate({
            ...values,
            status: DocumentStatusOptions.ToDo,
            createdBy: client.authStore.model?.id
          })
        }
        defaultValues={{
          name: '',
          bidding: '',
          customer: ''
        }}
        loading={createDocument.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={schema}
          name={'name'}
          title={'Tên công trình'}
          options={{}}
        />
        <TextField
          schema={schema}
          name={'bidding'}
          title={'Tên gói thầu'}
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
  );
};

export type DocumentNewProps = DialogProps & {
  screen: 'wating' | 'mine' | 'all';
  search: DocumentSearch;
};

export const NewDocumentDialog: FC<DocumentNewProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
