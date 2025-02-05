/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { DetailResponse, cn } from 'portal-core';
import type { AnyObject, ObjectSchema } from 'yup';

import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { RequestDetailItem } from './request';

export type RequestInputProps = {
  schema: ObjectSchema<AnyObject>;
  projectId?: string;
};

export const RequestInput: FC<RequestInputProps> = ({ schema, projectId }) => {
  const { control, setValue, watch } = useStoreoForm();
  const containerRef = useRef<HTMLDivElement>(null);
  const [volumeMap, setVolumeMap] = useState<
    Record<string, { requestVolume: string }>
  >({});

  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: 'details',
    keyName: 'uid'
  });

  const [selectedDetails, setSelectedDetails] = useState(() => {
    const items = (fields as unknown as (DetailResponse & { group: string })[])
      .filter(field => !field.level.startsWith('e.'))
      .map(it => ({
        ...it,
        id: it.group
      }));

    return items;
  });

  const findIndexByLevel = useCallback(
    (level: string) => {
      return fields.findIndex(
        item => (item as unknown as TreeData<RequestDetailItem>).level === level
      );
    },
    [fields]
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (!name) return;

      const nameString = name as string;
      const detailIndex = nameString.split('.')[0];
      const level = _.get(value, `${detailIndex}.level`);
      const requestVolume = _.get(value, `${nameString}`);

      if (!level) return;

      setVolumeMap(prev => {
        const newMap = { ...prev };

        if (requestVolume === '') {
          delete newMap[level];
        } else {
          newMap[level] = {
            requestVolume
          };
        }

        return newMap;
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fields.forEach((it, index) => {
      if ((it as any).children?.length) {
        setValue(`details[${index}].hasChild`, true);
        setValue(`details[${index}].requestVolume`, 0);
      } else {
        setValue(`details[${index}].hasChild`, false);
      }
    });
  }, [fields, setValue]);

  const handleNewItemFromPick = useCallback(() => {
    if (projectId) {
      showModal({
        title: 'Chọn hạng mục trong hợp đồng',
        className: 'flex min-w-[600px] flex-col',
        children: ({ close }) => (
          <PickDetailInput
            projectId={projectId}
            value={selectedDetails}
            onChange={value => {
              if (!value.length) return;

              const items = _.chain(value)
                .sortBy('level')
                .map(it => ({ ...it, group: it.id }))
                .value();

              setSelectedDetails(items);

              const itemsToRemove = fields
                .map((field, index) => ({
                  item: field as unknown as TreeData<RequestDetailItem>,
                  index
                }))
                .filter(
                  ({ item }) =>
                    !item.level.startsWith('e.') &&
                    !items.some(v => v.level === item.level)
                )
                .reverse();

              itemsToRemove.forEach(({ index }) => {
                remove(index);
              });

              const newItems = items.filter(
                it => findIndexByLevel(it.level) === -1
              );

              if (newItems.length) {
                newItems.forEach(item => {
                  const existingFields =
                    fields as unknown as TreeData<RequestDetailItem>[];

                  const insertIndex = existingFields.findIndex(
                    field => field.level.localeCompare(item.level) > 0
                  );

                  if (insertIndex === -1) {
                    append(item);
                  } else {
                    insert(insertIndex, item);
                  }
                });
              }

              close();
            }}
          />
        )
      });
    }
  }, [
    projectId,
    selectedDetails,
    setValue,
    findIndexByLevel,
    append,
    insert,
    fields,
    remove,
    volumeMap
  ]);

  const handleNewItemFromCustom = useCallback(() => {
    showModal({
      title: 'Thêm hạng mục ngoài hợp đồng',
      className: 'flex min-w-[500px] flex-col',
      children: ({ close }) => (
        <NewCustomRequestDetailForm
          onSubmit={values => {
            const newItem = {
              title: values.title,
              unit: values.unit,
              level: `e.${fields.length}`,
              group: `e.${fields.length}`,
              children: []
            };

            append(newItem);

            setTimeout(() => {
              containerRef.current?.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }, 100);

            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [append, fields.length]);

  const handleRemoveItem = useCallback(
    (index: number, level: string) => {
      if (level.startsWith('e.')) {
        remove(index);
      }
    },
    [remove]
  );

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex items-end justify-between'}>
        <span className={'text-sm font-medium'}>Hạng mục công việc</span>
        <div className={'flex gap-2'}>
          <Button
            className={'bg-orange-500 text-sm hover:bg-orange-400'}
            type={'button'}
            onClick={handleNewItemFromCustom}
          >
            <PlusIcon className={'mr-2 h-4 w-4'} />
            Thêm hạng mục ngoài HĐ
          </Button>
          <Button
            type={'button'}
            className={cn('text-sm')}
            onClick={handleNewItemFromPick}
          >
            <PlusIcon className={'mr-2 h-4 w-4'} />
            Chọn hạng mục trong HĐ
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="border-appBlue max-h-[300px] overflow-auto rounded-md border pb-2"
      >
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
              <TableHead className="bg-appBlueLight text-appWhite w-[80px] items-center whitespace-nowrap border-r p-2 text-center">
                Đơn vị
              </TableHead>
              <TableHead className="bg-appBlueLight text-appWhite items-center whitespace-nowrap border-r p-2 text-center">
                Khối lượng yêu cầu
              </TableHead>
              <TableHead className="bg-appBlueLight text-appWhite items-center whitespace-nowrap border-r p-2 text-center">
                Ghi chú
              </TableHead>
              <TableHead className="bg-appBlueLight text-appWhite w-[50px] items-center whitespace-nowrap border-r p-2 text-center">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length ? (
              (fields as unknown as TreeData<RequestDetailItem>[]).map(
                (it, index) => {
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
                      <TableCell className={'border-r px-2 py-1 text-center'}>
                        {it.unit}
                      </TableCell>
                      <TableCell className={'border-r p-1'}>
                        <Show when={it.children?.length === 0}>
                          <NumericField
                            schema={schema}
                            name={`details[${index}].requestVolume`}
                          />
                        </Show>
                      </TableCell>
                      <TableCell className={'w-40 p-1'}>
                        <Show when={it.children?.length === 0}>
                          <TextareaField
                            schema={schema}
                            name={`details[${index}].note`}
                          />
                        </Show>
                      </TableCell>
                      <TableCell className={'border-r p-1 text-center'}>
                        <Show when={it.level.startsWith('e.')}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/20 h-6 w-6"
                            onClick={() => handleRemoveItem(index, it.level)}
                          >
                            <TrashIcon className="text-destructive h-4 w-4" />
                          </Button>
                        </Show>
                      </TableCell>
                    </TableRow>
                  );
                }
              )
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
