import { FC } from 'react';

import {
  Button,
  DialogFooter,
  Form,
  TextareaField,
  success
} from '@storeo/theme';

import { CreateRequestSchema, requestApi } from '../../../api';
import { RequestDetailListField } from '../request-detail/request-detail-list-field';

export type NewRequestFormProps = {
  projectId: string;
  onSuccess?: () => void;
};

export const NewRequestForm: FC<NewRequestFormProps> = props => {
  const createRequest = requestApi.create.useMutation({
    onSuccess: async () => {
      success('Tạo yêu cầu mua hàng thành công');
      props.onSuccess?.();
    }
  });

  return (
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
          projectId: props.projectId
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
        options={{ projectId: props.projectId }}
      />
      <DialogFooter className={'mt-4'}>
        <Button type="submit">Chấp nhận</Button>
      </DialogFooter>
    </Form>
  );
};
