import _ from 'lodash';
import { api } from 'portal-api';
import { array, boolean, date, mixed, number, object, string } from 'yup';

import { FC, useMemo } from 'react';

import {
  BusinessFormProps,
  DatePickerField,
  Form,
  TextField,
  TextareaField
} from '@minhdtb/storeo-theme';

import { RequestInputField } from './request-input-field';

const schema = object({
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
    .required('Hãy chọn ít nhất 1 hạng mục'),
  attachments: mixed().optional()
});

export type EditRequestFormProps = BusinessFormProps & {
  issueId: string;
};

export const EditRequestForm: FC<EditRequestFormProps> = ({
  issueId,
  onCancel
}) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const request = api.request.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const listDetails = useMemo(() => {
    const v = request.data?.expand?.requestDetail_via_request.map(it => {
      return {
        ...it.expand.detail,
        requestVolume: it.volume
      };
    });

    return _.chain(v)
      .sortBy('level')
      .map(it => {
        const children = v?.filter(i => i.parent === it.id);
        return {
          ...it,
          children
        };
      })
      .value();
  }, [request.data]);

  return (
    <Form
      schema={schema}
      onSubmit={values => {
        console.log(values);
      }}
      defaultValues={{
        code: issue.data?.code,
        title: issue.data?.title,
        startDate: new Date(Date.parse(issue.data?.startDate ?? '')),
        endDate: new Date(Date.parse(issue.data?.endDate ?? '')),
        details: listDetails
      }}
      className={'flex flex-col gap-4'}
      loading={issue.isPending || request.isPending}
      onCancel={onCancel}
    >
      <TextareaField schema={schema} name="title" title="Nội dung công việc" />
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
        options={{ projectId: issue.data?.project }}
      />
    </Form>
  );
};
