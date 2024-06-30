import {
  SearchSchemaInput,
  createFileRoute,
  useNavigate
} from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { ShoppingCartIcon } from 'lucide-react';

import {
  IssueResponse,
  IssueStatusOptions,
  IssueTypeOptions,
  Match,
  Switch,
  formatDate
} from '@storeo/core';
import { CommonTable, DebouncedInput } from '@storeo/theme';

import { IssuesSearchSchema, issueApi } from '../../../../../../api/issue';
import {
  EmployeeDisplay,
  NewIssueButton,
  RequestStatus
} from '../../../../../../components';

const Component = () => {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const issues = issueApi.list.useSuspenseQuery({
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
            <Match when={info.row.original.type === IssueTypeOptions.Request}>
              <ShoppingCartIcon
                className={'text-red-500'}
                width={20}
                height={20}
              />
            </Match>
          </Switch>
          <span className={'w-full truncate'}>{info.getValue()}</span>
        </div>
      ),
      header: () => 'Nội dung',
      footer: info => info.column.id,
      size: 400
    }),
    columnHelper.accessor('status', {
      cell: ({ row }) =>
        row.original.status === IssueStatusOptions.Normal ? (
          <div
            className={
              'bg-appSuccess flex w-fit items-center justify-center rounded-full px-2 py-1 text-xs text-white'
            }
          >
            An toàn
          </div>
        ) : row.original.status === IssueStatusOptions.Warning ? (
          <div
            className={
              'bg-appWarning flex w-fit items-center justify-center rounded-full px-2 py-1 text-xs'
            }
          >
            Nguy cơ chậm
          </div>
        ) : (
          <div
            className={
              'bg-appError flex w-fit items-center justify-center rounded-full px-2 py-1 text-xs text-white'
            }
          >
            Đang chậm
          </div>
        ),
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
      id: 'status',
      cell: ({ row }) => (
        <Switch>
          <Match when={row.original.type === IssueTypeOptions.Request}>
            <RequestStatus issueId={row.original.id} />
          </Match>
        </Switch>
      ),
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
              to: './',
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
        fixedWidth={true}
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
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/all/'
)({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    IssuesSearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({
    deps: { search },
    context: { queryClient },
    params: { projectId }
  }) =>
    queryClient?.ensureQueryData(
      issueApi.list.getOptions({
        ...search,
        projectId
      })
    )
});
