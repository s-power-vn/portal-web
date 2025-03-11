import type { SearchSchemaInput } from '@tanstack/react-router';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { FilesIcon } from 'lucide-react';
import { IssueData, ListSchema, api } from 'portal-api';

import { formatDateTime } from '@minhdtb/storeo-core';
import { CommonTable, DebouncedInput } from '@minhdtb/storeo-theme';

import {
  DynamicIcon,
  EmployeeDisplay,
  IssueAssigneeDisplay,
  IssueDeadlineStatus,
  IssueStatus,
  IssueType,
  NewIssueButton
} from '../../../../../../components';

const Component = () => {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  const { data: requestType } = api.objectType.byType.useSuspenseQuery({
    variables: 'Request'
  });

  const issues = api.issue.listByObjectType.useSuspenseQuery({
    variables: {
      ...search,
      projectId,
      objectTypeId: requestType?.id
    }
  });

  const columnHelper = createColumnHelper<IssueData>();

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => info.row.index + 1,
      header: () => '#',
      size: 50
    }),
    columnHelper.accessor('title', {
      cell: info => {
        const typeObject = info.row.original.expand?.object.expand?.type;

        return (
          <div className={'flex w-full min-w-0 items-center gap-2'}>
            <DynamicIcon
              svgContent={typeObject?.icon}
              className={'h-4 w-4 flex-shrink-0'}
              style={{ color: typeObject?.color || '#6b7280' }}
            />
            <span className={'truncate'}>{info.getValue()}</span>
          </div>
        );
      },
      header: () => 'Nội dung',
      footer: info => info.column.id,
      size: 400,
      minSize: 400,
      maxSize: 400
    }),
    columnHelper.accessor('deadlineStatus', {
      cell: ({ row }) => <IssueDeadlineStatus issueId={row.original.id} />,
      header: () => 'Tiến độ',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('assignees', {
      cell: ({ row }) => (
        <IssueAssigneeDisplay issueId={row.original.id} maxVisible={1} />
      ),
      header: () => 'Người thực hiện',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.display({
      id: 'expand.issueFile_via_issue',
      cell: info => {
        const files = info.row.original.expand?.issueFile_via_issue;
        return files && files.length > 0 ? (
          <FilesIcon className="h-4 w-4 text-gray-500" />
        ) : null;
      },
      header: () => '',
      footer: info => info.column.id,
      size: 100
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
    columnHelper.display({
      id: 'object',
      cell: ({ row }) => <IssueType issueId={row.original.id} />,
      header: () => 'Loại',
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
  '/_authenticated/project/$projectId/issues/request/'
)({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: async ({
    deps: { search },
    context: { queryClient },
    params: { projectId }
  }) => {
    const requestType = await queryClient?.ensureQueryData(
      api.objectType.byType.getOptions('Request')
    );

    return queryClient?.ensureQueryData(
      api.issue.listByObjectType.getOptions({
        ...search,
        projectId,
        objectTypeId: requestType?.id
      })
    );
  }
});
