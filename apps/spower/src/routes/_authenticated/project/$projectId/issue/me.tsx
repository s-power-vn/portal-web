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

import { useState } from 'react';

import { IssueResponse, formatDate } from '@storeo/core';
import {
  Button,
  DebouncedInput,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  getMyIssues
} from '../../../../../api/issue';
import { EmployeeDisplay, IssueType } from '../../../../../components';
import { NewRequestDialog } from '../../../../../components/models/request/new-request-dialog';
import { RequestDetailDialog } from '../../../../../components/models/request/request-detail-dialog';

const Component = () => {
  const [openRequestNew, setOpenRequestNew] = useState(false);
  const [openRequestDetail, setOpenRequestDetail] = useState(false);
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const [selected, setSelected] = useState<IssueResponse>();
  const issues = useSuspenseQuery(getMyIssues(projectId, search));

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
      cell: info => <span className={'truncate'}>{info.getValue()}</span>,
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
    data: issues.data?.items ?? [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className={'flex flex-col gap-2'}>
      <NewRequestDialog
        projectId={projectId}
        open={openRequestNew}
        setOpen={setOpenRequestNew}
      />
      {selected ? (
        <RequestDetailDialog
          open={openRequestDetail}
          setOpen={setOpenRequestDetail}
          issueId={selected.id}
          search={search}
        ></RequestDetailDialog>
      ) : null}
      <div className={'flex items-center justify-between gap-2'}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={'flex gap-1'}>
              <PlusIcon />
              Thêm công việc
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            side="bottom"
            align="start"
            sideOffset={2}
          >
            <DropdownMenuItem
              onClick={() => {
                setOpenRequestNew(true);
              }}
            >
              Yêu cầu mua hàng
            </DropdownMenuItem>
            <DropdownMenuItem>Hợp đồng</DropdownMenuItem>
            <DropdownMenuItem>Tạm ứng</DropdownMenuItem>
            <DropdownMenuItem>Biên bản bàn giao</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          style={
            table.getRowModel().rows.length
              ? {
                  width: table.getTotalSize()
                }
              : undefined
          }
        >
          <TableHeader className={'bg-appGrayLight'}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="flex">
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="flex items-center"
                    style={
                      table.getRowModel().rows.length
                        ? {
                            width: header.getSize()
                          }
                        : undefined
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
                <TableRow
                  key={row.id}
                  className={'flex cursor-pointer last:border-b-0'}
                  onClick={() => {
                    setSelected(row.original);
                    setOpenRequestDetail(true);
                  }}
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
              <TableRow className={'border-b-0'}>
                <TableCell
                  colSpan={columns.length}
                  className="h-16  text-center"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        totalItems={issues.data?.totalItems}
        totalPages={issues.data?.totalPages}
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
  '/_authenticated/project/$projectId/issue/me'
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
  }) => queryClient?.ensureQueryData(getMyIssues(projectId, search)),
  beforeLoad: () => ({ title: 'Công việc của tôi' })
});
