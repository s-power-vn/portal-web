/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { PlusIcon, TrashIcon, X } from 'lucide-react';
import { type DetailResponse, cn } from 'portal-core';
import { v4 } from 'uuid';
import type { AnyObject, ObjectSchema } from 'yup';

import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import { Show } from '@minhdtb/storeo-core';
import {
  Button,
  NumericField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextField,
  TextareaField,
  showModal,
  useStoreoForm
} from '@minhdtb/storeo-theme';

import { TreeData } from '../../../commons/utils';
import { PickDetailInput } from '../detail/pick-detail-input';
import { NewCustomRequestDetailForm } from './new-custom-request-detail-form';

export type RequestInputProps = {
  schema: ObjectSchema<AnyObject>;
  projectId?: string;
};

export const RequestInput: FC<RequestInputProps> = ({ schema, projectId }) => {
  const { control, setValue, getValues } = useStoreoForm();
  const [selectedDetails, setSelectedDetails] = useState<DetailResponse[]>([]);
  const { fields, append, remove } = useFieldArray({
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

  const handlePick = useCallback(() => {
    if (projectId) {
      showModal({
        title: 'Chọn hạng mục trong hợp đồng',
        className: 'flex min-w-[600px] flex-col',
        children: ({ close }) => (
          <PickDetailInput
            projectId={projectId}
            value={selectedDetails}
            onChange={value => {
              setSelectedDetails(value);
              const items = _.chain(value)
                .sortBy('level')
                .filter(
                  it =>
                    _.findIndex(
                      fields as {
                        id?: string;
                        expand?: {
                          detail: {
                            id: string;
                          };
                        };
                      }[],
                      v => v.id === it.id || v.expand?.detail.id === it.id
                    ) === -1
                )
                .map(it => ({
                  ...it,
                  isNew: true
                }))
                .value();

              append(items);
              items.forEach((_, index) => {
                setValue(`details[${index}].requestVolume`, 0);
              });
              close();
            }}
          />
        )
      });
    }
  }, [append, fields, projectId, selectedDetails, setValue]);

  const handleCustomRequest = useCallback(() => {
    showModal({
      title: 'Thêm hạng mục ngoài hợp đồng',
      className: 'flex min-w-[500px] flex-col',
      children: ({ close }) => (
        <NewCustomRequestDetailForm
          onSubmit={values => {
            const newItem = {
              level: `e.${fields.length}`,
              title: values.title,
              unit: values.unit,
              hasChild: false,
              children: [],
              id: v4(),
              isNew: true
            };

            append(newItem);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [append, fields.length]);

  const handleClear = useCallback(() => {
    const currentItems = fields as unknown as TreeData<DetailResponse>[];

    // Add only non-new items to deletedIds
    const newDeletedIds = currentItems
      .filter(item => item.id && !item.isNew)
      .map(item => item.id as string);

    setValue('deletedIds', newDeletedIds);
    setValue('details', []);
  }, [setValue, fields]);

  const handleRemoveItem = useCallback(
    (index: number, item: TreeData<DetailResponse>) => {
      const currentItems = fields as unknown as TreeData<DetailResponse>[];
      const currentDeletedIds = getValues('deletedIds') || [];
      let newDeletedIds = [...currentDeletedIds];

      console.log(currentItems);

      const parentItem = currentItems.find(it =>
        it.children?.some(child => child.id === item.id)
      );

      // Add non-new item ID to deletedIds
      if (item.id && !item.isNew) {
        newDeletedIds.push(item.id);
      }

      if (parentItem) {
        // Check remaining children before removal
        const remainingChildren = currentItems.filter(
          it => it.parent === parentItem.id && it.id !== item.id
        );

        remove(index);

        // Only remove parent if this was the last child
        if (remainingChildren.length === 0) {
          const parentIndex = currentItems.findIndex(
            it => it.id === parentItem.id
          );
          if (parentItem.id && !parentItem.isNew) {
            newDeletedIds.push(parentItem.id);
          }
          remove(parentIndex);
        }
      } else {
        remove(index);
      }

      setValue('deletedIds', Array.from(new Set(newDeletedIds)));
    },
    [fields, remove, setValue, getValues]
  );

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex items-end justify-between'}>
        <span className={'text-sm font-medium'}>Hạng mục công việc</span>
        <div className={'flex gap-2'}>
          <Button
            className={'text-sm'}
            variant={'destructive'}
            type={'button'}
            onClick={handleClear}
          >
            <TrashIcon className={'mr-2 h-4 w-4'} />
            Xóa tất cả
          </Button>
          <Button
            className={'bg-orange-500 text-sm hover:bg-orange-400'}
            type={'button'}
            onClick={handleCustomRequest}
          >
            <PlusIcon className={'mr-2 h-4 w-4'} />
            Thêm hạng mục ngoài HĐ
          </Button>
          <Button
            type={'button'}
            className={cn('text-sm')}
            onClick={handlePick}
          >
            <PlusIcon className={'mr-2 h-4 w-4'} />
            Chọn hạng mục trong HĐ
          </Button>
        </div>
      </div>
      <div className="border-appBlue max-h-[300px] overflow-auto rounded-md border pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-appBlueLight text-appWhite w-[80px] whitespace-nowrap border-r p-2 text-center">
                STT
              </TableHead>
              <TableHead className="bg-appBlueLight text-appWhite w-[50px] whitespace-nowrap border-r p-2 text-center">
                ID
              </TableHead>
              <TableHead className="bg-appBlueLight text-appWhite w-[500px] items-center whitespace-nowrap border-r p-2">
                Mô tả công việc mời thầu
              </TableHead>
              <TableHead className="bg-appBlueLight text-appWhite items-center whitespace-nowrap border-r p-2 text-center">
                Khối lượng yêu cầu
              </TableHead>
              <TableHead className="bg-appBlueLight text-appWhite items-center whitespace-nowrap border-r p-2 text-center">
                Ghi chú
              </TableHead>
              <TableHead className="bg-appBlueLight text-appWhite w-[50px] items-center whitespace-nowrap p-2 text-center">
                Xóa
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length ? (
              _.chain(fields as unknown as TreeData<DetailResponse>[])
                .sortBy('level')
                .value()
                .map((it: TreeData<DetailResponse>, index: number) => {
                  return (
                    <TableRow key={it.id} className="text-xs">
                      <TableCell className={'border-r px-2 py-1 text-center'}>
                        <Show when={it.children?.length === 0}>
                          <TextField
                            schema={schema}
                            name={`details[${index}].index`}
                          />
                        </Show>
                      </TableCell>
                      <TableCell className={'border-r px-2 py-1'}>
                        {it.level}
                      </TableCell>
                      <TableCell className={'border-r px-2 py-1'}>
                        {it.title}
                      </TableCell>
                      <TableCell className={'border-r p-1'}>
                        <Show when={it.children?.length === 0}>
                          <NumericField
                            schema={schema}
                            name={`details[${index}].requestVolume`}
                          ></NumericField>
                        </Show>
                      </TableCell>
                      <TableCell className={'w-40 p-1'}>
                        <Show when={it.children?.length === 0}>
                          <TextareaField
                            schema={schema}
                            name={`details[${index}].note`}
                          ></TextareaField>
                        </Show>
                      </TableCell>
                      <TableCell className={'border-r p-1 text-center'}>
                        <Show when={it.children?.length === 0}>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index, it)}
                            className="rounded p-1 text-red-500 hover:bg-red-50"
                            aria-label="Xóa hạng mục"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Show>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có hạng mục công việc
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
