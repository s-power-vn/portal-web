import type { SearchSchemaInput } from '@tanstack/react-router';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { CircleDollarSignIcon } from 'lucide-react';
import { SearchSchema, api } from 'portal-api';
import type { IssueResponse } from 'portal-core';
import { IssueTypeOptions } from 'portal-core';

import { Match, Switch, formatDateTime } from '@minhdtb/storeo-core';
import { CommonTable, DebouncedInput } from '@minhdtb/storeo-theme';

import {
  EmployeeDisplay,
  IssueDeadlineStatus,
  IssueStatus,
  NewIssueButton
} from '../../../../../../components';

const Component = () => {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const issues = api.issue.listPrice.useSuspenseQuery({
    variables: {
      ...search,
      projectId
    }
  });

  const columnHelper = createColumnHelper<IssueResponse>();

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => info.row.index + 1,
      header: () => '#',
      size: 50
    }),
    columnHelper.accessor('title', {
      cell: info => (
        <div className={'flex w-full items-center gap-2'}>
          <Switch fallback={<span></span>}>
            <Match when={info.row.original.type === IssueTypeOptions.Price}>
              <CircleDollarSignIcon className={'h-5 w-5 text-blue-500'} />
            </Match>
          </Switch>
          <span className={'w-full truncate'}>{info.getValue()}</span>
        </div>
      ),
      header: () => 'Nội dung',
      footer: info => info.column.id,
      size: 400
    }),
    columnHelper.accessor('deadlineStatus', {
      cell: ({ row }) => <IssueDeadlineStatus issueId={row.original.id} />,
      header: () => 'Tiến độ',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('assignee', {
      cell: ({ row }) => <EmployeeDisplay employeeId={row.original.assignee} />,
      header: () => 'Người thực hiện',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.display({
      id: 'state',
      cell: ({ row }) => <IssueStatus issueId={row.original.id} />,
      header: () => 'Trạng thái',
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
      cell: ({ row }) => formatDateTime(row.original.created),
      header: () => 'Ngày tạo',
      footer: info => info.column.id,
      size: 150
    }),
    columnHelper.accessor('updated', {
      cell: ({ row }) => formatDateTime(row.original.updated),
      header: () => 'Ngày cập nhật',
      footer: info => info.column.id,
      size: 150
    })
  ];

  return (
    <div className={'flex flex-col gap-2 p-2'}>
      <div className={'flex items-center justify-between gap-2'}>
        <NewIssueButton projectId={projectId} />
        <DebouncedInput
          value={search.filter}
          className={'h-8 w-56'}
          placeholder={'Tìm kiếm...'}
          onChange={value =>
            navigate({
              to: '.',
              search: {
                ...search,
                filter: value ?? ''
              }
            })
          }
        />
      </div>
      <CommonTable
        data={issues.data?.items ?? []}
        columns={columns}
        rowCount={issues.data?.totalItems}
        pageCount={issues.data?.totalPages}
        pageIndex={search.pageIndex}
        pageSize={search.pageSize}
        onRowClick={row =>
          navigate({
            to: './$issueId',
            params: {
              issueId: row.original.id
            }
          })
        }
        onPageNext={() =>
          navigate({
            to: '.',
            search: prev => {
              return { ...prev, pageIndex: prev.pageIndex + 1 };
            }
          })
        }
        onPagePrev={() =>
          navigate({
            to: '.',
            search: prev => {
              return { ...prev, pageIndex: prev.pageIndex - 1 };
            }
          })
        }
        onPageSizeChange={pageSize =>
          navigate({
            to: '.',
            search: {
              ...search,
              pageSize
            }
          })
        }
      ></CommonTable>
    </div>
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/price/'
)({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    SearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({
    deps: { search },
    context: { queryClient },
    params: { projectId }
  }) =>
    queryClient?.ensureQueryData(
      api.issue.list.getOptions({
        ...search,
        projectId
      })
    )
});
