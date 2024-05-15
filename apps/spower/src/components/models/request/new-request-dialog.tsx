import { useQueryClient } from '@tanstack/react-query';

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

import { CreateRequestSchema, requestApi } from '../../../api';
import { issueApi } from '../../../api/issue';
import { RequestDetailListField } from '../request-detail/request-detail-list-field';

const Content: FC<Omit<NewRequestDialogProps, 'open'>> = ({
  setOpen,
  projectId
}) => {
  const queryClient = useQueryClient();

  const createRequest = requestApi.create.useMutation({
    onSuccess: async request => {
      setOpen(false);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.listFull.getKey(projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: issueApi.list.getKey({
            projectId
          })
        }),
        queryClient.invalidateQueries({
          queryKey: issueApi.listMine.getKey({
            projectId
          })
        })
      ]);
    }
  });

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
        className={'mt-2 flex flex-col gap-2'}
        loading={createRequest.isPending}
        onSubmit={values =>
          createRequest.mutate({
            ...values,
            projectId
          })
        }
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
