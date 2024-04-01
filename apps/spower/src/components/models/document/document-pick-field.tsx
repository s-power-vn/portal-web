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

import { DocumentPick } from './document-pick';

export type DocumentPickArrayProps = {
  schema: ObjectSchema<AnyObject>;
  documentId?: string;
};

export const DocumentPickArray: FC<DocumentPickArrayProps> = ({
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
          setValue(`documents[${index}].requestVolume`, 0);
        }
      });
  }, [fields, setValue]);

  return (
    <div className={'flex flex-col gap-2'}>
      {documentId ? (
        <DocumentPick
          documentId={documentId}
          open={openPick}
          setOpen={setOpenPick}
          onChange={value => {
            setValue('documents', []);
            const items = _.sortBy(value, 'level');
            append(items);
            items.forEach((it, index) => {
              setValue(`documents[${index}].requestVolume`, null);
            });
          }}
        ></DocumentPick>
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
                    index
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

export type DocumentPickFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<Omit<DocumentPickArrayProps, 'schema'>, S>;

export const DocumentPickField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: DocumentPickFieldProps<S>) => {
  return (
    <FormField {...props}>
      <DocumentPickArray schema={props.schema} {...options} />
    </FormField>
  );
};
