import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import {
  Column,
  ExpandedState,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import _ from 'lodash';
import { SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import PocketBase from 'pocketbase';

import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';

import { DocumentDetailResponse, usePb } from '@storeo/core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

function getDocumentDetails(documentId: string, pb?: PocketBase) {
  return pb?.collection<DocumentDetailResponse>('documentDetail').getFullList({
    filter: `document = "${documentId}"`
  });
}

export function documentDetailsOptions(documentId: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['documentDetails', documentId],
    queryFn: () => getDocumentDetails(documentId, pb)
  });
}

type DocumentDetailData = DocumentDetailResponse & {
  hasChild?: boolean;
  children?: DocumentDetailData[];
};

function makeCatTree(data: DocumentDetailData[]) {
  const groupedByParents = _.groupBy(data, 'parent');
  const catsById = _.keyBy(data, 'id');
  _.each(_.omit(groupedByParents, ''), function (children, parentId) {
    catsById[parentId].children = children;
  });
  _.each(catsById, function (cat) {
    cat.hasChild = !_.isEmpty(cat.children);
  });
  return groupedByParents[''];
}

export type DocumentOverviewProps = {
  documentId: string;
};

export const DocumentOverview: FC<DocumentOverviewProps> = ({ documentId }) => {
  const pb = usePb();
  const documentDetailsQuery = useSuspenseQuery(
    documentDetailsOptions(documentId, pb)
  );

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const data = useMemo(
    () => makeCatTree(documentDetailsQuery.data ?? []),
    [documentDetailsQuery.data]
  );
  const columnHelper = createColumnHelper<DocumentDetailData>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div
              className={'flex items-center gap-1 '}
              style={{
                paddingLeft: `${row.depth}rem`
              }}
            >
              {row.getCanExpand() ? (
                <button
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: 'pointer' }
                  }}
                >
                  {row.getIsExpanded() ? (
                    <SquareMinusIcon width={16} height={16} />
                  ) : (
                    <SquarePlusIcon width={16} height={16} />
                  )}
                </button>
              ) : null}
            </div>
          );
        },
        header: () => (
          <div className={'flex items-center justify-center'}>#</div>
        ),
        footer: info => info.column.id,
        size: 50
      }),
      columnHelper.display({
        id: 'level',
        cell: ({ row }) => row.id,
        header: () => (
          <div className={'flex items-center justify-center'}>#</div>
        ),
        footer: info => info.column.id,
        size: 50
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('volume', {
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'KL thầu',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('unit', {
        cell: info => info.getValue(),
        header: () => 'Đơn vị',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('unitPrice', {
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => (
          <span className={'whitespace-nowrap'}>Đơn giá dự thầu</span>
        ),
        footer: info => info.column.id,
        size: 120
      }),
      columnHelper.display({
        id: '1',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'KL yêu cầu',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.display({
        id: '2',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'KL phát sinh',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.display({
        id: '3',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Đơn giá NCC',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.display({
        id: '4',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'NCC',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.display({
        id: '5',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Trạng thái NCC',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.display({
        id: '6',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Trạng thái HĐ',
        footer: info => info.column.id,
        size: 100
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnPinning: {
        left: ['id', 'level', 'title']
      }
    },
    state: {
      expanded
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
    getRowId: (_, index, parent) => {
      return `${parent?.id ? parent?.id + '.' : ''}${index + 1}`;
    }
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

  const getCommonPinningStyles = (
    column: Column<DocumentDetailData>
  ): CSSProperties => {
    const isPinned = column.getIsPinned();

    return {
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? 90 : 0
    };
  };

  const visibleColumns = table.getVisibleLeafColumns();

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: index => visibleColumns[index].getSize(),
    getScrollElement: () => parentRef.current,
    horizontal: true,
    overscan: 3
  });

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 3,
    measureElement: element => {
      return element?.getBoundingClientRect().height;
    }
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();

  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return (
    <div
      ref={parentRef}
      className={'relative h-72 grow overflow-auto rounded-md border'}
    >
      <Table
        style={{
          display: 'grid'
        }}
      >
        <TableHeader
          className={'bg-appGrayLight'}
          style={{
            display: 'grid',
            position: 'sticky',
            top: 0,
            zIndex: 99
          }}
        >
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow className={'flex'} key={headerGroup.id}>
              {virtualPaddingLeft ? (
                <TableHead
                  style={{ display: 'flex', width: virtualPaddingLeft }}
                />
              ) : null}
              {virtualColumns.map(column => {
                const header = headerGroup.headers[column.index];
                return (
                  <TableHead
                    key={header.id}
                    className={
                      'bg-appGrayLight flex items-center border-r p-1 last:border-r-0'
                    }
                    style={{
                      ...getCommonPinningStyles(header.column),
                      width: header.getSize()
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
                );
              })}
              {virtualPaddingRight ? (
                <TableHead
                  style={{ display: 'flex', width: virtualPaddingRight }}
                />
              ) : null}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            position: 'relative' //needed for absolute positioning of rows
          }}
        >
          {virtualRows.length ? (
            virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as Row<DocumentDetailData>;
              const visibleCells = row.getVisibleCells();
              return (
                <TableRow
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: '100%'
                  }}
                >
                  {virtualPaddingLeft ? (
                    <TableCell
                      style={{ display: 'flex', width: virtualPaddingLeft }}
                    />
                  ) : null}
                  {virtualColumns.map(vc => {
                    const cell = visibleCells[vc.index];
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          ...getCommonPinningStyles(cell.column),
                          width: cell.column.getSize()
                        }}
                        className={
                          'bg-appWhite flex items-center border-r p-1 text-xs last:border-r-0'
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                  {virtualPaddingRight ? (
                    <TableCell
                      style={{ display: 'flex', width: virtualPaddingRight }}
                    />
                  ) : null}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>Không có dữ liệu.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
