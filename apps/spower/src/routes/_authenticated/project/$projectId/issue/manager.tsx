import { useSuspenseQuery } from '@tanstack/react-query';
import {
  SearchSchemaInput,
  createFileRoute,
  useNavigate
} from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { ShoppingCartIcon } from 'lucide-react';

import { useState } from 'react';

import {
  IssueResponse,
  IssueTypeOptions,
  Match,
  Switch,
  formatDate
} from '@storeo/core';
import { CommonTable, DebouncedInput } from '@storeo/theme';

import {
  IssuesSearch,
  IssuesSearchSchema,
  getAllIssues
} from '../../../../../api/issue';
import { EmployeeDisplay } from '../../../../../components';
import { NewIssueButton } from '../../../../../components/models/issue/new-issue-button';
import { NewRequestDialog } from '../../../../../components/models/request/new-request-dialog';
import { RequestDetailDialog } from '../../../../../components/models/request/request-detail-dialog';
import { RequestStatus } from '../../../../../components/models/request/request-status';

const Component = () => {
  const [openRequestNew, setOpenRequestNew] = useState(false);
  const [openRequestDetail, setOpenRequestDetail] = useState(false);
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const [selected, setSelected] = useState<IssueResponse>();
  const issues = useSuspenseQuery(getAllIssues(projectId, search));

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
      cell: info => (
        <div className={'flex w-full items-center gap-1'}>
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
        onRowClick={row => {
          setSelected(row.original);
          setOpenRequestDetail(true);
        }}
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
