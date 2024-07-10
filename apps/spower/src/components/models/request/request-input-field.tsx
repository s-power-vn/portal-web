/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { PlusIcon } from 'lucide-react';
import { AnyObject, ObjectSchema } from 'yup';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { DetailResponse, cn } from '@storeo/core';
import {
  Button,
  FormField,
  FormFieldProps,
  NumericField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  closeModal,
  showModal
} from '@storeo/theme';

import { TreeData } from '../../../commons/utils';
import { PickDetailInput } from '../detail/pick-detail-input';

export type RequestInputProps = {
  schema: ObjectSchema<AnyObject>;
  projectId?: string;
};

export const RequestInput: FC<RequestInputProps> = ({ schema, projectId }) => {
  const { control, setValue } = useFormContext();
  const [selectedDetails, setSelectedDetails] = useState<DetailResponse[]>([]);
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

  const modalId = useRef<string | undefined>();

  const handlePick = useCallback(() => {
    if (projectId) {
      modalId.current = showModal({
        title: 'Chọn hạng mục',
        className: 'flex min-w-[400px] flex-col',
        children: (
          <PickDetailInput
            projectId={projectId}
            value={selectedDetails}
            onChange={value => {
              setSelectedDetails(value);
              const items = _.sortBy(value, 'level');
              setValue('details', []);
              append(items);
              items.forEach((_, index) => {
                setValue(`details[${index}].requestVolume`, 0);
              });
              if (modalId.current) {
                closeModal(modalId.current);
              }
            }}
          />
        )
      });
    }
  }, [append, projectId, selectedDetails, setValue]);

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex items-end justify-between'}>
        <span className={'text-sm font-medium'}>Hạng mục công việc</span>
        <div className={'flex gap-2'}>
          <Button className={'text-sm'} type={'reset'}>
            <PlusIcon className={'mr-2 h-4 w-4'} />
            Thêm hạng mục ngoài HĐ
          </Button>
          <Button
            variant="outline"
            type={'reset'}
            className={cn('text-sm')}
            onClick={handlePick}
          >
            Chọn
          </Button>
        </div>
      </div>
      <div className="border-appBlue max-h-[300px] overflow-auto rounded-md border pb-2">
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
                  'bg-appBlueLight text-appWhite w-[50px] whitespace-nowrap border-r p-2'
                }
              >
                ID
              </TableHead>
              <TableHead
                className={
                  'bg-appBlueLight text-appWhite w-[500px] items-center whitespace-nowrap border-r p-2'
                }
              >
                Mô tả công việc
              </TableHead>
              <TableHead
                className={
                  'bg-appBlueLight text-appWhite items-center whitespace-nowrap p-2'
                }
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
                      <TableCell className={'p-1'}>
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

export type RequestInputFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<Omit<RequestInputProps, 'schema'>, S>;

export const RequestInputField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: RequestInputFieldProps<S>) => {
  return (
    <FormField {...props}>
      <RequestInput schema={props.schema} {...options} />
    </FormField>
  );
};
