import { array, date, mixed, object, string } from 'yup';

import type { FC } from 'react';

import {
  BusinessFormProps,
  DatePickerField,
  Form,
  TextField,
  TextareaField
} from '@minhdtb/storeo-theme';

import { MultipleFileSelectField } from '../../../file';
import { PriceInputField } from '../price-input-field';

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
  data: array()
    .of(
      object().shape({
        id: string().optional()
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
    .required('Hãy chọn ít nhất 1 hạng mục'),
  attachments: mixed().optional()
});

export type NewPriceFormProps = BusinessFormProps & {
  projectId: string;
};

export const NewPriceForm: FC<NewPriceFormProps> = ({
  projectId,
  onSuccess,
  onCancel
}) => {
  return (
    <Form
      schema={schema}
      defaultValues={{
        title: '',
        startDate: new Date(),
        data: []
      }}
      className={'flex flex-col gap-4'}
      onSubmit={data => {}}
      onCancel={onCancel}
    >
      <TextareaField
        schema={schema}
        name={'title'}
        title={'Nội dung công việc'}
      />
      <div className={'flex items-start gap-2'}>
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
      <PriceInputField
        schema={schema}
        name={'data'}
        options={{ projectId: projectId }}
      />
      <MultipleFileSelectField
        schema={schema}
        name={'attachments'}
        title={'File đính kèm'}
      />
    </Form>
  );
};
