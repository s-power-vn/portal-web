import { PlusIcon } from '@radix-ui/react-icons';
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import PocketBase from 'pocketbase';

import { FC, useMemo } from 'react';

import { DocumentRequestResponse, usePb } from '@storeo/core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { DocumentDetailData } from './document-overview';

function getDocumentRequests(documentId: string, pb?: PocketBase) {
  return pb
    ?.collection<DocumentRequestResponse>('documentRequest')
    .getFullList({
      filter: `document = "${documentId}"`
    });
}

export function documentRequestsOptions(documentId: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['documentRequests', documentId],
    queryFn: () => getDocumentRequests(documentId, pb)
  });
}

export type DocumentRequestProps = {
  documentId: string;
};

export const DocumentRequest: FC<DocumentRequestProps> = ({ documentId }) => {
  const pb = usePb();
  const documentRequestsQuery = useSuspenseQuery(
    documentRequestsOptions(documentId, pb)
  );

  const queryClient = useQueryClient();

  const columnHelper = createColumnHelper<DocumentRequestResponse>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'index',
        cell: info => info.row.index + 1,
        header: () => '#',
        footer: info => info.column.id,
        size: 30
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => 'Yêu cầu mua hàng',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('created', {
        cell: info => info.getValue(),
        header: () => 'Ngày',
        footer: info => info.column.id,
        size: 200
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: documentRequestsQuery.data ?? [],
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true
  });

  return (
    <>
      <div className={'flex flex-col gap-2'}>
        <div className={'flex gap-2'}>
          <Button className={'flex gap-1'} onClick={() => {}}>
            <PlusIcon />
            Thêm yêu cầu mua hàng
          </Button>
          <Button disabled={true} className={'flex gap-1'} onClick={() => {}}>
            <PlusIcon />
            Thêm nhà cung cấp
          </Button>
        </div>
        <div className={'flex'}>
          <div className={'rounded-md border'}>
            <Table>
              <TableHeader className={'bg-appGrayLight'}>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        className={
                          'border-r first:rounded-tl-md last:rounded-tr-md last:border-r-0'
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
                    <TableRow key={row.id} className={'last:border-b-0'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.getSize()
                          }}
                          className={'border-r px-2 py-1 last:border-r-0'}
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
                      className="h-16 text-center"
                    >
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
