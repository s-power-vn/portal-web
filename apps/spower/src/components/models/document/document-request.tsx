import { PlusIcon } from '@radix-ui/react-icons';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import PocketBase from 'pocketbase';

import { FC, useMemo, useState } from 'react';

import { DocumentRequestResponse, formatDate, usePb } from '@storeo/core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { DocumentRequestItem } from './document-request-item';
import { DocumentRequestNew } from './document-request-new';

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
  const [openDocumentRequestNew, setOpenDocumentRequestNew] = useState(false);
  const pb = usePb();
  const documentRequestsQuery = useSuspenseQuery(
    documentRequestsOptions(documentId, pb)
  );

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
        header: () => 'Nội dung',
        footer: info => info.column.id,
        size: 400
      }),
      columnHelper.accessor('status', {
        cell: info => info.getValue(),
        header: () => 'Trạng thái',
        footer: info => info.column.id,
        size: 200
      }),
      columnHelper.accessor('created', {
        cell: info => formatDate(info.getValue()),
        header: () => 'Ngày tạo',
        footer: info => info.column.id,
        size: 150
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
      <DocumentRequestNew
        documentId={documentId}
        open={openDocumentRequestNew}
        setOpen={setOpenDocumentRequestNew}
      />
      <div className={'flex flex-col gap-2'}>
        <div className={'flex justify-between gap-2'}>
          <div className={'flex gap-2'}>
            <Button
              className={'flex gap-1'}
              onClick={() => setOpenDocumentRequestNew(true)}
            >
              <PlusIcon />
              Thêm yêu cầu mua hàng
            </Button>
          </div>
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
        <div
          className={
            'bg-appGrayLight flex h-[calc(100vh-270px)] flex-col gap-2 overflow-auto rounded-md border p-4'
          }
        >
          {documentRequestsQuery.data
            ? documentRequestsQuery.data.map(
                (documentRequest: DocumentRequestResponse) => (
                  <DocumentRequestItem
                    key={documentRequest.id}
                    documentRequestId={documentRequest.id}
                  />
                )
              )
            : null}
        </div>
      </div>
    </>
  );
};
