import { DateTime } from 'luxon';
import { array, boolean, number, object, string } from 'yup';

import { FC } from 'react';

import {
  Button,
  DatePickerField,
  DialogFooter,
  Form,
  TextareaField,
  success
} from '@storeo/theme';

import { requestApi } from '../../../api';
import { RequestDetailListField } from '../request-detail/request-detail-list-field';

const schema = object().shape({
  name: string().required('Hãy nhập nội dung'),
  startDate: object().required('Hãy chọn ngày bắt đầu'),
  endDate: object()
    .required('Hãy chọn ngày kết thúc')
    .test({
      name: 'checkEndDate',
      message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      test: function (value) {
        const startDate = this.parent.startDate;
        const endDate = this.parent.endDate;
        if (startDate && endDate) {
          return (
            new Date(startDate.toJSDate()).getTime() <
            new Date(endDate.toJSDate()).getTime()
          );
        }
        return true;
      }
    }),
  details: array()
    .of(
      object().shape({
        id: string().optional(),
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
      schema={schema}
      defaultValues={{
        name: '',
        startDate: DateTime.now()
      }}
      className={'mt-2 flex flex-col gap-4'}
      loading={createRequest.isPending}
      onSubmit={values => {
        return createRequest.mutate({
          ...values,
          startDate: (values.startDate as DateTime)?.toJSDate().toISOString(),
          endDate: (values.endDate as DateTime)?.toJSDate().toISOString(),
          project: props.projectId
        });
      }}
    >
      <TextareaField
        schema={schema}
        name={'name'}
        title={'Nội dung công việc'}
      />
      <div className={'flex items-center gap-2'}>
        <DatePickerField
          schema={schema}
          name={'startDate'}
          title={'Ngày bắt đầu'}
          className={'w-full'}
          options={{
            showTime: true
          }}
        />
        <span className={'px-2 pt-4'}>-</span>
        <DatePickerField
          schema={schema}
          name={'endDate'}
          title={'Ngày kết thúc'}
          className={'w-full'}
          options={{
            showTime: true
          }}
        />
      </div>
      <RequestDetailListField
        schema={schema}
        name={'details'}
        options={{ projectId: props.projectId }}
      />
      <DialogFooter className={'mt-4'}>
        <Button type="submit">Chấp nhận</Button>
      </DialogFooter>
    </Form>
  );
};
