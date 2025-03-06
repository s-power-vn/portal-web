import { getUser } from 'portal-core';
import { InferType, array, object, string } from 'yup';

import { FC } from 'react';

import { BusinessFormProps, Form } from '@minhdtb/storeo-theme';

import { SelectEmployeeByConditionField } from '../../domains';

const schema = object().shape({
  users: array()
    .of(string().required('Vui lòng chọn ít nhất 1 người dùng'))
    .min(1, 'Vui lòng chọn ít nhất 1 người dùng')
    .required('Vui lòng chọn ít nhất 1 người dùng')
});

export type NewChatFormProps = BusinessFormProps<InferType<typeof schema>>;

export const NewChatForm: FC<NewChatFormProps> = ({ onSuccess, onCancel }) => {
  const currentUser = getUser();

  return (
    <Form
      schema={schema}
      onSuccess={onSuccess}
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
