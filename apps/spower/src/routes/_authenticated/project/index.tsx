import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';

import { useState } from 'react';

import { ProjectResponse, formatDate } from '@storeo/core';
import { CommonTable, DebouncedInput } from '@storeo/theme';

import { ProjectData, ProjectSearchSchema, getAllProjects } from '../../../api';
import { EditProjectDialog, EmployeeDisplay } from '../../../components';

const Component = () => {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<ProjectResponse>();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  const projects = useSuspenseQuery(getAllProjects(search));

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
        <EmployeeDisplay employeeId={row.original.createdBy} />
      ),
      header: () => 'Người tạo',
      footer: info => info.column.id,
      size: 150
    }),
    columnHelper.accessor('created', {
      cell: ({ row }) => formatDate(row.original.created),
      header: () => 'Ngày tạo',
      footer: info => info.column.id,
      size: 170
    }),
    columnHelper.accessor('updated', {
      cell: ({ row }) => formatDate(row.original.updated),
      header: () => 'Ngày cập nhật',
      footer: info => info.column.id,
      size: 170
    })
  ];

  return (
    <>
      {project ? (
        <EditProjectDialog
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
        <CommonTable
          data={projects.data?.items ?? []}
          columns={columns}
          rowCount={projects.data?.totalItems}
          pageCount={projects.data?.totalPages}
          pageIndex={search.pageIndex}
          pageSize={search.pageSize}
          fixedWidth={true}
          onRowClick={row =>
            navigate({
              to: './$projectId',
              params: {
                projectId: row.original.id
              }
            })
          }
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
        ></CommonTable>
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
    queryClient?.ensureQueryData(getAllProjects(deps.search))
});
