import { useSuspenseQuery } from '@tanstack/react-query';
import {
  SearchSchemaInput,
  createFileRoute,
  useNavigate
} from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';

import { IssueResponse, formatDate } from '@storeo/core';
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

import {
  IssuesSearch,
  IssuesSearchSchema,
  getAllIssues
} from '../../../../../api/issue';
import { EmployeeDisplay, IssueType } from '../../../../../components';

const Component = () => {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const customers = useSuspenseQuery(getAllIssues(projectId, search));

  const columnHelper = createColumnHelper<IssueResponse>();

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => (
        <div className={'flex items-center justify-center'}>
          {info.row.index + 1}
        </div>
      ),
      header: () => '#',
      size: 50
    }),
    columnHelper.accessor('title', {
      cell: info => info.getValue(),
      header: () => 'Nội dung',
      footer: info => info.column.id,
      size: 300
    }),
    columnHelper.accessor('type', {
      cell: ({ row }) => <IssueType type={row.original.type}></IssueType>,
      header: () => 'Phân loại',
      footer: info => info.column.id,
      size: 150
    }),
    columnHelper.accessor('assignee', {
      cell: ({ row }) => <EmployeeDisplay employeeId={row.original.assignee} />,
      header: () => 'Người thực hiện',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('createdBy', {
      cell: ({ row }) => (
        <EmployeeDisplay employeeId={row.original.createdBy} />
      ),
      header: () => 'Người tạo',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('created', {
      cell: ({ row }) => formatDate(row.original.created),
      header: () => 'Ngày tạo',
      footer: info => info.column.id,
      size: 150
    }),
    columnHelper.accessor('updated', {
      cell: ({ row }) => formatDate(row.original.updated),
      header: () => 'Ngày cập nhật',
      footer: info => info.column.id,
      size: 150
    })
  ];

  const table = useReactTable({
    data: customers.data?.items ?? [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex items-center justify-between gap-2'}>
        <Button className={'flex gap-1'}>
          <PlusIcon />
          Thêm công việc
        </Button>
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
      </div>

      <div className={'overflow-auto rounded-md border'}>
        <Table
          style={{
            width: table.getTotalSize()
          }}
        >
          <TableHeader className={'bg-appGrayLight'}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="flex">
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="flex items-center"
                    style={{
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className={'flex cursor-pointer last:border-b-0'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className="flex items-center p-1"
                      style={{
                        width: cell.column.getSize()
                      }}
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
        totalItems={customers.data?.totalItems}
        totalPages={customers.data?.totalPages}
        pageIndex={search.pageIndex ?? 1}
        pageSize={search.pageSize ?? 10}
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
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issue/manager'
)({
  component: Component,
  validateSearch: (input: IssuesSearch & SearchSchemaInput) =>
    IssuesSearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({
    deps: { search },
    context: { queryClient },
    params: { projectId }
  }) => queryClient?.ensureQueryData(getAllIssues(projectId, search)),
  beforeLoad: () => ({ title: 'Tất cả công việc' })
});
