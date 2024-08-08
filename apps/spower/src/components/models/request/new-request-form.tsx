import { array, boolean, date, number, object, string } from 'yup';

import { FC } from 'react';

import {
  BusinessFormProps,
  DatePickerField,
  Form,
  TextField,
  TextareaField,
  success
} from '@storeo/theme';

import { requestApi } from '../../../api';
import { RequestInputField } from './request-input-field';

const schema = object().shape({
  title: string().required('Hãy nhập nội dung'),
  code: string().required('Hãy nhập số phiếu'),
  startDate: date().required('Hãy chọn ngày bắt đầu'),
  endDate: date()
    .required('Hãy chọn ngày kết thúc')
    .test({
      name: 'checkEndDate',
      message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      test: function () {
        const startDate = this.parent.startDate;
        const endDate = this.parent.endDate;
        if (startDate && endDate) {
          return startDate.getTime() < endDate.getTime();
        }
        return true;
      }
    }),
  details: array()
    .of(
      object().shape({
        id: string().optional(),
        index: string().optional(),
        hasChild: boolean().optional(),
        requestVolume: number()
          .transform((_, originalValue) =>
            Number(originalValue?.toString().replace(/,/g, '.'))
          )
          .typeError('Hãy nhập khối lượng yêu cầu')
          .when('hasChild', (hasChild, schema) => {
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

export type NewRequestFormProps = BusinessFormProps & {
  projectId: string;
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
      schema={schema}
      defaultValues={{
        title: '',
        startDate: new Date(),
        details: []
      }}
      className={'flex flex-col gap-4'}
      loading={createRequest.isPending}
      onSubmit={values => {
        return createRequest.mutate({
          ...values,
          project: props.projectId
        });
      }}
      onCancel={props.onCancel}
    >
      <TextareaField
        schema={schema}
        name={'title'}
        title={'Nội dung công việc'}
      />
      <div className={'flex items-center gap-2'}>
        <TextField
          schema={schema}
          name={'code'}
          className={'flex-1'}
          title={'Số phiếu'}
          options={{
            maxLength: 20
          }}
        />
        <DatePickerField
          schema={schema}
          name={'startDate'}
          title={'Ngày bắt đầu'}
          className={'flex-1'}
          options={{
            showTime: true
          }}
        />
        <span className={'pt-4'}>-</span>
        <DatePickerField
          schema={schema}
          name={'endDate'}
          title={'Ngày kết thúc'}
          className={'flex-1'}
          options={{
            showTime: true
          }}
        />
      </div>
      <RequestInputField
        schema={schema}
        name={'details'}
        options={{ projectId: props.projectId }}
      />
    </Form>
  );
};
