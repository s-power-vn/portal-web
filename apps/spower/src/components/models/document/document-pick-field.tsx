/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExpandedState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import { AnyObject, ObjectSchema } from 'yup';

import { FC, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { DocumentDetailData, arrayToTree, cn } from '@storeo/core';
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

import { IndeterminateCheckbox } from '../../checkbox/indeterminate-checkbox';
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

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const { control, setValue } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: 'documents',
    keyName: 'uid'
  });

  const data = useMemo(() => arrayToTree((fields as any[]) ?? []), [fields]);

  const columnHelper = createColumnHelper<
    DocumentDetailData & {
      requestVolume?: number;
    }
  >();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div className={'flex w-full items-center '}>
              {row.getCanExpand() ? (
                <button
                  className={'cursor-pointer'}
                  onClick={e => {
                    e.stopPropagation();
                    row.toggleExpanded();
                  }}
                >
                  {row.getIsExpanded() ? (
                    <SquareMinusIcon width={18} height={18} />
                  ) : (
                    <SquarePlusIcon width={18} height={18} />
                  )}
                </button>
              ) : null}
            </div>
          );
        },
        header: () => (
          <div className={'flex w-full items-center justify-center'}>#</div>
        ),
        footer: info => info.column.id,
        size: 30
      }),
      columnHelper.accessor('level', {
        cell: info => info.getValue(),
        header: () => (
          <div className={'flex w-full items-center justify-center'}>ID</div>
        ),
        footer: info => info.column.id,
        size: 50
      }),
      columnHelper.display({
        id: 'select',
        cell: ({ row }) => (
          <div className={'flex h-full w-full items-center justify-center'}>
            {row.subRows.length > 0 ? (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsAllSubRowsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />
            ) : (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />
            )}
          </div>
        ),
        header: () => (
          <div className={'flex h-full w-full items-center justify-center'}>
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          </div>
        ),
        footer: info => info.column.id,
        size: 30
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc',
        footer: info => info.column.id,
        size: 470
      }),
      columnHelper.accessor('requestVolume', {
        cell: ({ row }) =>
          row.subRows.length === 0 ? (
            <NumericField
              name={`documents[${row.index}].requestVolume`}
              schema={schema}
            ></NumericField>
          ) : null,
        header: () => 'Khối lượng yêu cầu',
        footer: info => info.column.id,
        size: 150
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableFilters: true,
    enableGlobalFilter: true,
    filterFromLeafRows: true,
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true
  });

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

  return (
    <div className={'flex flex-col gap-2'}>
      {documentId ? (
        <DocumentPick
          documentId={documentId}
          open={openPick}
          setOpen={setOpenPick}
          onChange={value => setValue('documents', value)}
        ></DocumentPick>
      ) : null}
      <div className="max-h-[300px] overflow-auto rounded-md border pb-2">
        <Table
          style={{
            width: table.getTotalSize() + 10
          }}
        >
          <TableHeader
            className={
              'bg-appGrayLight  items-center whitespace-nowrap border-r p-1'
            }
          >
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={
                      'bg-appGrayLight  items-center whitespace-nowrap border-r p-1'
                    }
                    style={{
                      width: header.column.getSize()
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className={cn(
                    'cursor-pointer',
                    row.getIsSelected() ||
                      row.getIsSomeSelected() ||
                      row.getIsAllSubRowsSelected()
                      ? 'bg-appBlueLight text-appWhite hover:bg-appBlueLight'
                      : null
                  )}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize()
                      }}
                      className={'border-r px-2 py-1'}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 border-r text-center"
                >
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
