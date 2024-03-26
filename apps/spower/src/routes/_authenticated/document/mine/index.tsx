import { Cross2Icon } from '@radix-ui/react-icons';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import PocketBase from 'pocketbase';
import { InferType, number, object, string } from 'yup';

import {
  CustomerResponse,
  DocumentResponse,
  UserResponse,
  usePb
} from '@storeo/core';
import {
  Button,
  DebouncedInput,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { DocumentStatus, EmployeeItem } from '../../../../components';

const documentSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type DocumentSearch = InferType<typeof documentSearchSchema>;

function getDocuments(search: DocumentSearch, pb?: PocketBase) {
  const filter = `(name ~ "${search.filter ?? ''}" || bidding ~ "${search.filter ?? ''}")`;
  return pb
    ?.collection<DocumentResponse>('document')
    .getList(search.pageIndex, search.pageSize, {
      filter: filter + `&& (createdBy = "${pb?.authStore.model?.id}")`,
      sort: '-created',
      expand: 'customer,assignee,createdBy'
    });
}

export function documentsOptions(search: DocumentSearch, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['documents', 'mine', search],
    queryFn: () => getDocuments(search, pb)
  });
}

const Component = () => {
  const pb = usePb();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const documentsQuery = useSuspenseQuery(documentsOptions(search, pb));

  const columnHelper = createColumnHelper<DocumentResponse>();

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => (
        <div className={'flex items-center justify-center'}>
          {info.row.index + 1}
        </div>
      ),
      header: () => '#'
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => 'Tên công trình',
      footer: info => info.column.id
    }),
    columnHelper.accessor('bidding', {
      cell: info => info.getValue(),
      header: () => 'Tên gói thầu',
      footer: info => info.column.id
    }),
    columnHelper.accessor('customer', {
      cell: ({ row }) => {
        return (
          row.original.expand as {
            customer: CustomerResponse;
          }
        ).customer.name;
      },
      header: () => 'Chủ đầu tư',
      footer: info => info.column.id
    }),
    columnHelper.accessor('assignee', {
      cell: ({ row }) => (
        <EmployeeItem
          data={
            (
              row.original.expand as {
                assignee: UserResponse;
              }
            ).assignee
          }
        />
      ),
      header: () => 'Người đang xử lý',
      footer: info => info.column.id
    }),
    columnHelper.accessor('createdBy', {
      cell: ({ row }) => (
        <EmployeeItem
          data={
            (
              row.original.expand as {
                createdBy: UserResponse;
              }
            ).createdBy
          }
        />
      ),
      header: () => 'Người tạo',
      footer: info => info.column.id
    }),
    columnHelper.accessor('status', {
      cell: info => <DocumentStatus value={info.getValue()} />,
      header: () => 'Trạng thái',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex gap-1'}>
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
    data: documentsQuery.data?.items ?? [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <Outlet />
      <div className={'flex flex-col gap-2'}>
        <DebouncedInput
          value={search.filter}
          className={'h-8 w-56'}
          placeholder={'Tìm kiếm...'}
          onChange={value =>
            navigate({
              to: './',
              search: {
                ...search,
                filter: value ?? ''
              }
            })
          }
        />
        <div className={'rounded-md border'}>
          <Table>
            <TableHeader className={'bg-appGrayLight'}>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={'border-r last:border-r-0'}
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
                    className={'cursor-pointer'}
                    onClick={() =>
                      navigate({
                        to: './$documentId/edit',
                        params: {
                          documentId: row.original.id
                        }
                      })
                    }
                  >
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
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          totalItems={documentsQuery.data?.totalItems}
          totalPages={documentsQuery.data?.totalPages}
          pageIndex={search.pageIndex}
          pageSize={search.pageSize}
          onPageNext={() =>
            navigate({
              to: './',
              search: prev => {
                return { ...prev, pageIndex: prev.pageIndex + 1 };
              }
            })
          }
          onPagePrev={() =>
            navigate({
              to: './',
              search: prev => {
                return { ...prev, pageIndex: prev.pageIndex - 1 };
              }
            })
          }
          onPageSizeChange={pageSize =>
            navigate({
              to: './',
              search: {
                ...search,
                pageSize
              }
            })
          }
        ></Pagination>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_authenticated/document/mine/')({
  component: Component,
  validateSearch: (search?: Record<string, unknown>) =>
    documentSearchSchema.validateSync(search),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { pb, queryClient } }) =>
    queryClient?.ensureQueryData(documentsOptions(deps.search, pb))
});
