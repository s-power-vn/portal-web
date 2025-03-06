import { MsgChat, api } from 'portal-api';
import { MsgChatTypeOptions, getUser } from 'portal-core';
import { array, object, string } from 'yup';

import { FC } from 'react';

import { BusinessFormProps, Form, error } from '@minhdtb/storeo-theme';

import { SelectEmployeeByConditionField } from '../../domains';

const schema = object().shape({
  users: array()
    .of(string().required('Vui lòng chọn ít nhất 1 người dùng'))
    .min(1, 'Vui lòng chọn ít nhất 1 người dùng')
    .required('Vui lòng chọn ít nhất 1 người dùng')
});

export type NewChatFormProps = BusinessFormProps<MsgChat>;

export const NewChatForm: FC<NewChatFormProps> = ({ onSuccess, onCancel }) => {
  const currentUser = getUser();

  const createChat = api.chat.createChat.useMutation({
    onSuccess,
    onError: () => {
      error('Lỗi khi tạo cuộc trò chuyện');
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values =>
        createChat.mutate({
          type:
            values.users.length > 1
              ? MsgChatTypeOptions.Group
              : MsgChatTypeOptions.Private,
          participants: values?.users ?? [],
          name: values.users.length > 1 ? 'Nhóm chat' : undefined
        })
      }
      onCancel={onCancel}
      onError={e => {
        console.log(e);
      }}
      className="flex flex-col gap-3"
    >
      <SelectEmployeeByConditionField
        schema={schema}
        name="users"
        options={{
          condition: `id != "${currentUser?.id}"`,
          placeholder: 'Tìm kiếm người dùng',
          multiple: true
        }}
      />
    </Form>
  );
};
