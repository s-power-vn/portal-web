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

import { CreateRequestSchema, useCreateRequest } from '../../../api';
import { RequestDetailListField } from '../request-detail/request-detail-list-field';

const Content: FC<Omit<NewRequestDialogProps, 'open'>> = ({
  setOpen,
  projectId
}) => {
  const createDocumentRequest = useCreateRequest(projectId, () =>
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
        schema={CreateRequestSchema}
        defaultValues={{
          name: ''
        }}
        className={'mt-4 flex flex-col gap-3'}
        loading={createDocumentRequest.isPending}
        onSubmit={values => createDocumentRequest.mutate(values)}
      >
        <TextareaField
          schema={CreateRequestSchema}
          name={'name'}
          title={'Nội dung'}
        />
        <RequestDetailListField
          schema={CreateRequestSchema}
          name={'details'}
          options={{ projectId }}
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
  projectId: string;
};

export const NewRequestDialog: FC<NewRequestDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
