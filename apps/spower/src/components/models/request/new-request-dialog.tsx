import { Dispatch, FC, SetStateAction } from 'react';

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

import { NewRequestSchema, useCreateRequest } from '../../../api';
import { RequestDetailListField } from '../request-detail/request-detail-list-field';

const Content: FC<Omit<NewRequestDialogProps, 'open'>> = ({
  setOpen,
  documentId
}) => {
  const createDocumentRequest = useCreateRequest(documentId, () =>
    setOpen(false)
  );

  return (
    <DialogContent className="flex min-w-[800px] flex-col">
      <DialogHeader>
        <DialogTitle>Tạo yêu cầu mua hàng</DialogTitle>
        <DialogDescription className={'italic'}>
          Tạo yêu cầu mua hàng mới. Cho phép chọn từ danh sách hạng mục
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={NewRequestSchema}
        defaultValues={{
          name: ''
        }}
        className={'mt-4 flex flex-col gap-3'}
        loading={createDocumentRequest.isPending}
        onSubmit={values => createDocumentRequest.mutate(values)}
      >
        <TextareaField
          schema={NewRequestSchema}
          name={'name'}
          title={'Nội dung'}
        />
        <RequestDetailListField
          schema={NewRequestSchema}
          name={'details'}
          options={{ documentId }}
        />
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
};

export type NewRequestDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  documentId: string;
};

export const NewRequestDialog: FC<NewRequestDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
