import { Cross2Icon } from '@radix-ui/react-icons';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { EditIcon, UserIcon } from 'lucide-react';

import React, { FC } from 'react';

import {
  DepartmentResponse,
  DialogProps,
  DocumentDetailData,
  UserResponse
} from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

const Content: FC<Omit<ListDocumentSupplierDialogProps, 'open'>> = ({
  documentRequestDetail
}) => {
  const columnHelper = createColumnHelper<UserResponse>();

  const columns = [
    columnHelper.accessor('avatar', {
      cell: ({ row }) => (
        <div className={'flex justify-center'}>
          <Avatar className={'h-6 w-6 '}>
            <AvatarImage
              src={`http://localhost:8090/api/files/user/${row.original.id}/${row.original.avatar}`}
            />
            <AvatarFallback className={'text-sm'}>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </div>
      ),
      header: () => <div className={'flex justify-center'}>Ảnh</div>,
      footer: info => info.column.id
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => 'Họ tên',
      footer: info => info.column.id
    }),
    columnHelper.accessor('email', {
      cell: info => info.getValue(),
      header: () => 'Email',
      footer: info => info.column.id
    }),
    columnHelper.accessor('department', {
      cell: ({ row }) => {
        return (
          row.original.expand as {
            department: DepartmentResponse;
          }
        ).department.name;
      },
      header: () => 'Phòng ban',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => {
        return (
          <div className={'flex gap-1'}>
            <Button className={'h-6 px-3'} onClick={() => {}}>
              <EditIcon className={'h-3 w-3'} />
            </Button>
            <Button variant={'destructive'} className={'h-6 px-3'}>
              <Cross2Icon className={'h-3 w-3'} />
            </Button>
          </div>
        );
      },
      header: () => 'Thao tác'
    })
  ];

  const table = useReactTable({
    data: [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <DialogContent className={'min-w-[600px]'}>
      <DialogHeader>
        <DialogTitle>Quản lý nhà cung cấp</DialogTitle>
        <DialogDescription className={'italic'}>
          {documentRequestDetail ? (
            <>
              <span
                className={'inline font-bold'}
              >{`Hạng mục: ${documentRequestDetail.level} `}</span>
              {` (${documentRequestDetail.title})`}
            </>
          ) : (
            'Tạo đầu mục mô tả công việc chính'
          )}
        </DialogDescription>
      </DialogHeader>
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
                  Chưa có nhà cung cấp nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
};

export type ListDocumentSupplierDialogProps = DialogProps & {
  documentRequestDetail?: DocumentDetailData;
};

export const ListDocumentSupplierDialog: FC<
  ListDocumentSupplierDialogProps
> = ({ open, setOpen, documentRequestDetail }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Content
        setOpen={setOpen}
        documentRequestDetail={documentRequestDetail}
      />
    </Dialog>
  );
};
