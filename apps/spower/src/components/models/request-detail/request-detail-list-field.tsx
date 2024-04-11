/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { AnyObject, ObjectSchema } from 'yup';

import { FC, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { DetailResponse } from '@storeo/core';
import {
  FormField,
  FormFieldProps,
  NumericField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { TreeData } from '../../../commons/utils';
import { PickDetailDialog } from '../detail/pick-detail-dialog';

export type DocumentRequestDetailListProps = {
  schema: ObjectSchema<AnyObject>;
  documentId?: string;
};

export const DocumentRequestDetailList: FC<DocumentRequestDetailListProps> = ({
  schema,
  documentId
}) => {
  const [openPick, setOpenPick] = useState(false);

  const { control, setValue } = useFormContext();

  const { fields, append } = useFieldArray({
    control,
    name: 'details',
    keyName: 'uid'
  });

  useEffect(() => {
    _.chain(fields)
      .sortBy('level')
      .value()
      .forEach((it, index) => {
        if ((it as any).children?.length) {
          setValue(`details[${index}].hasChild`, true);
          setValue(`details[${index}].requestVolume`, 0);
        } else {
          setValue(`details[${index}].hasChild`, false);
        }
      });
  }, [fields, setValue]);

  return (
    <div className={'flex flex-col gap-2'}>
      {documentId ? (
        <PickDetailDialog
          documentId={documentId}
          open={openPick}
          setOpen={setOpenPick}
          onChange={value => {
            const items = _.sortBy(value, 'level');
            setValue('details', []);
            append(items);
            items.forEach((_, index) => {
              setValue(`details[${index}].requestVolume`, 0);
            });
          }}
        ></PickDetailDialog>
      ) : null}
      <div className="max-h-[300px] overflow-auto rounded-md border pb-2">
        <Table>
          <TableHeader
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 2
            }}
          >
            <TableRow>
              <TableHead
                className={
                  'bg-appGrayLight flex items-center justify-center whitespace-nowrap border-r p-1'
                }
              >
                ID
              </TableHead>
              <TableHead
                className={
                  'bg-appGrayLight  items-center whitespace-nowrap border-r p-1'
                }
              >
                Mô tả công việc
              </TableHead>
              <TableHead
                className={'bg-appGrayLight items-center whitespace-nowrap p-1'}
              >
                Khối lượng yêu cầu
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length ? (
              _.chain(fields)
                .sortBy('level')
                .map((it: TreeData<DetailResponse>, index: number) => {
                  return (
                    <TableRow key={it.id}>
                      <TableCell className={'border-r px-2 py-1'}>
                        {it.level}
                      </TableCell>
                      <TableCell className={'border-r px-2 py-1'}>
                        {it.title}
                      </TableCell>
                      <TableCell className={'px-2 py-1'}>
                        {it.children?.length === 0 ? (
                          <NumericField
                            schema={schema}
                            name={`details[${index}].requestVolume`}
                          ></NumericField>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })
                .value()
            ) : (
              <TableRow>
                <TableCell className="h-16 text-center" colSpan={3}>
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export type RequestDetailListFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<Omit<DocumentRequestDetailListProps, 'schema'>, S>;

export const RequestDetailListField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: RequestDetailListFieldProps<S>) => {
  return (
    <FormField {...props}>
      <DocumentRequestDetailList schema={props.schema} {...options} />
    </FormField>
  );
};
