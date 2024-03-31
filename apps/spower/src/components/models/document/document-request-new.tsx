import { object, string } from 'yup';

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
  TextField
} from '@storeo/theme';

import { DocumentPick } from './document-pick';

const schema = object().shape({
  name: string().required('Hãy nhập nội dung')
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[500px] min-w-[800px] flex-col">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu mua hàng</DialogTitle>
          <DialogDescription>Tạo yêu cầu mua hàng mới.</DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          defaultValues={{
            name: ''
          }}
          className={'mt-4 flex flex-col gap-3'}
        >
          <TextField schema={schema} name={'name'} title={'Nội dung'} />
          <DocumentPick
            documentId={documentId}
            onChange={value => {
              console.log(value);
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
