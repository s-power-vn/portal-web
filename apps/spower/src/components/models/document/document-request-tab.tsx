import { PlusIcon } from '@radix-ui/react-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ForwardIcon } from 'lucide-react';

import { FC, useMemo, useState } from 'react';

import { RequestResponse, formatDate } from '@storeo/core';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { getAllRequests } from '../../../api';
import { NewRequestDialog } from '../request/new-request-dialog';
import { RequestItem } from '../request/request-item';

export type DocumentRequestTabProps = {
  documentId: string;
};

export const DocumentRequestTab: FC<DocumentRequestTabProps> = ({
  documentId
}) => {
  const [openDocumentRequestNew, setOpenDocumentRequestNew] = useState(false);
  const requests = useSuspenseQuery(getAllRequests(documentId));

  const columnHelper = createColumnHelper<RequestResponse>();

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
    data: requests.data ?? [],
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true
  });

  return (
    <>
      <NewRequestDialog
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'outline'} className={'flex gap-1'}>
                <ForwardIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={'w-[800px]'}>
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
            </PopoverContent>
          </Popover>
        </div>
        <div
          className={
            'bg-appGrayLight flex h-[calc(100vh-215px)] flex-col gap-4 overflow-auto rounded-md border p-4'
          }
        >
          {requests.data
            ? requests.data.map((request: RequestResponse) => (
                <RequestItem key={request.id} requestId={request.id} />
              ))
            : null}
        </div>
      </div>
    </>
  );
};
