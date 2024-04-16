import { Cross2Icon } from '@radix-ui/react-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { EditIcon } from 'lucide-react';

import { useState } from 'react';

import { ProjectResponse, UserResponse } from '@storeo/core';
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
  ProjectData,
  ProjectSearchSchema,
  getWaitingProjects
} from '../../../api';
import { EditProjectDialog, EmployeeItem } from '../../../components';

const Component = () => {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<ProjectResponse>();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  const projectsQuery = useSuspenseQuery(getWaitingProjects(search));

  const columnHelper = createColumnHelper<ProjectData>();

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => info.row.index + 1,
      header: () => '#',
      size: 50
    }),
    columnHelper.accessor('name', {
      cell: info => (
        <div className={'w-[300px] truncate'}>{info.getValue()}</div>
      ),
      header: () => 'Tên công trình',
      footer: info => info.column.id,
      size: 300
    }),
    columnHelper.accessor('bidding', {
      cell: info => (
        <div className={'w-[300px] truncate'}>{info.getValue()}</div>
      ),
      header: () => 'Tên gói thầu',
      footer: info => info.column.id,
      size: 300
    }),
    columnHelper.accessor('customer', {
      cell: ({ row }) => (
        <div className={'w-[200px] truncate'}>
          {row.original.expand.customer.name}
        </div>
      ),
      header: () => 'Chủ đầu tư',
      footer: info => info.column.id,
      size: 200
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
      footer: info => info.column.id,
      size: 150
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex gap-1'}>
            <Button
              className={'h-6 px-3'}
              onClick={e => {
                e.stopPropagation();
                setProject(row.original);
                setOpen(true);
              }}
            >
              <EditIcon className={'h-3 w-3'} />
            </Button>
            <Button variant={'destructive'} className={'h-6 px-3'}>
              <Cross2Icon className={'h-3 w-3'} />
            </Button>
          </div>
        );
      },
      header: () => 'Thao tác',
      size: 300
    })
  ];

  const table = useReactTable({
    data: projectsQuery.data?.items ?? [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      {project ? (
        <EditProjectDialog
          screen={'wating'}
          search={search}
          project={project}
          open={open}
          setOpen={setOpen}
        />
      ) : null}
      <div className={'flex flex-col gap-2 p-2'}>
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
        <div className={'overflow-auto rounded-md border pb-2'}>
          <Table
            style={{
              width: table.getTotalSize()
            }}
          >
            <TableHeader className={'bg-appGrayLight'}>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={
                        'whitespace-nowrap first:rounded-tl-md last:rounded-tr-md last:border-r-0'
                      }
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
                    className={'cursor-pointer'}
                    onClick={() =>
                      navigate({
                        to: './$projectId',
                        params: {
                          projectId: row.original.id
                        }
                      })
                    }
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className={'p-2'}
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
          totalItems={projectsQuery.data?.totalItems}
          totalPages={projectsQuery.data?.totalPages}
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

export const Route = createFileRoute('/_authenticated/project/')({
  component: Component,
  validateSearch: (search?: Record<string, unknown>) =>
    ProjectSearchSchema.validateSync(search),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(getWaitingProjects(deps.search))
});
