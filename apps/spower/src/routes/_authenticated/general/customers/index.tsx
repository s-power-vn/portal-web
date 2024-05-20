import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import {
  Outlet,
  SearchSchemaInput,
  createFileRoute,
  useNavigate
} from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { EditIcon, SheetIcon } from 'lucide-react';

import { CustomerResponse } from '@storeo/core';
import {
  Button,
  CommonTable,
  DebouncedInput,
  SubmitButton,
  success,
  useConfirm
} from '@storeo/theme';

import { CustomersSearchSchema, customerApi } from '../../../../api';
import { PageHeader } from '../../../../components';

const Component = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  const listCustomers = customerApi.list.useSuspenseQuery({
    variables: search
  });

  const columnHelper = createColumnHelper<CustomerResponse>();

  const deleteCustomer = customerApi.delete.useMutation({
    onSuccess: async () => {
      success('Xóa chủ đầu tư thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: customerApi.list.getKey(search)
        })
      ]);
    }
  });

  const { confirm } = useConfirm();

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
      header: () => 'Tên chủ đầu tư',
      footer: info => info.column.id
    }),
    columnHelper.accessor('phone', {
      cell: info => info.getValue(),
      header: () => 'Số điện thoại',
      footer: info => info.column.id
    }),
    columnHelper.accessor('email', {
      cell: info => info.getValue(),
      header: () => 'Email',
      footer: info => info.column.id
    }),
    columnHelper.accessor('address', {
      cell: info => info.getValue(),
      header: () => 'Địa chỉ',
      footer: info => info.column.id
    }),
    columnHelper.accessor('note', {
      cell: info => info.getValue(),
      header: () => 'Ghi chú',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex gap-1'}>
            <SubmitButton
              className={'h-6 px-3'}
              onClick={e =>
                navigate({
                  to: './$customerId/edit',
                  params: {
                    customerId: row.original.id
                  },
                  search
                })
              }
            >
              <EditIcon className={'h-3 w-3'} />
            </SubmitButton>
            <SubmitButton
              variant={'destructive'}
              className={'h-6 px-3'}
              onClick={e => {
                confirm('Bạn chắc chắn muốn xóa chủ đầu tư này?', () => {
                  deleteCustomer.mutate(row.original.id);
                });
              }}
            >
              <Cross2Icon className={'h-3 w-3'} />
            </SubmitButton>
          </div>
        );
      },
      header: () => 'Thao tác'
    })
  ];

  return (
    <>
      <Outlet />
      <PageHeader title={'Quản lý chủ đầu tư'} />
      <div className={'flex flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <SubmitButton
            className={'flex gap-1'}
            onClick={() =>
              navigate({
                to: './new',
                search
              })
            }
          >
            <PlusIcon />
            Thêm chủ đầu tư
          </SubmitButton>
          <SubmitButton variant={'outline'} className={'flex gap-1'}>
            <SheetIcon />
            Nhập từ Excel
          </SubmitButton>
          <DebouncedInput
            value={search.filter}
            className={'h-9 w-56'}
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
          data={listCustomers.data?.items ?? []}
          columns={columns}
          rowCount={listCustomers.data?.totalItems}
          pageCount={listCustomers.data?.totalPages}
          pageIndex={search.pageIndex}
          pageSize={search.pageSize}
          onRowClick={row =>
            navigate({
              to: './$customerId/edit',
              params: {
                customerId: row.original.id
              },
              search
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

export const Route = createFileRoute('/_authenticated/general/customers/')({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    CustomersSearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(customerApi.list.getOptions(deps.search))
});
