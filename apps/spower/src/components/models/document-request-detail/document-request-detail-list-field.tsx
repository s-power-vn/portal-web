/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { AnyObject, ObjectSchema } from 'yup';

import { FC, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { DocumentDetailData } from '@storeo/core';
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

import { PickDocumentDetailDialog } from '../document-detail/pick-document-detail-dialog';

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
    name: 'documents',
    keyName: 'uid'
  });

  useEffect(() => {
    _.chain(fields)
      .sortBy('level')
      .value()
      .forEach((it, index) => {
        if ((it as any).children?.length) {
          setValue(`documents[${index}].hasChild`, true);
          setValue(`documents[${index}].requestVolume`, 0);
        } else {
          setValue(`documents[${index}].hasChild`, false);
        }
      });
  }, [fields, setValue]);

  return (
    <div className={'flex flex-col gap-2'}>
      {documentId ? (
        <PickDocumentDetailDialog
          documentId={documentId}
          open={openPick}
          setOpen={setOpenPick}
          onChange={value => {
            const items = _.sortBy(value, 'level');
            setValue('documents', []);
            append(items);
            items.forEach((_, index) => {
              setValue(`documents[${index}].requestVolume`, 0);
            });
          }}
        ></PickDocumentDetailDialog>
      ) : null}
      <div className="max-h-[300px] overflow-auto rounded-md border pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={
                  'bg-appGrayLight items-center whitespace-nowrap border-r p-1'
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
                .map(
                  (
                    it: DocumentDetailData & {
                      uid?: string;
                    },
                    index: number
                  ) => (
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
                            name={`documents[${index}].requestVolume`}
                          ></NumericField>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )
                )
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

export type DocumentRequestDetailListFieldProps<
  S extends ObjectSchema<AnyObject>
> = FormFieldProps<Omit<DocumentRequestDetailListProps, 'schema'>, S>;

export const DocumentRequestDetailListField = <
  S extends ObjectSchema<AnyObject>
>({
  options,
  ...props
}: DocumentRequestDetailListFieldProps<S>) => {
  return (
    <FormField {...props}>
      <DocumentRequestDetailList schema={props.schema} {...options} />
    </FormField>
  );
};
