import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  Outlet,
  SearchSchemaInput,
  createFileRoute,
  useNavigate
} from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { EditIcon, SheetIcon } from 'lucide-react';

import { SupplierResponse } from '@storeo/core';
import { CommonTable, DebouncedInput, SubmitButton } from '@storeo/theme';

import { SuppliersSearchSchema, supplierApi } from '../../../../api';
import { PageHeader } from '../../../../components';

const Component = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const listSuppliers = supplierApi.list.useSuspenseQuery({
    variables: search
  });

  const columnHelper = createColumnHelper<SupplierResponse>();

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
      header: () => 'Tên nhà cung cấp',
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
              onClick={() =>
                navigate({
                  to: './$supplierId/edit',
                  params: {
                    supplierId: row.original.id
                  },
                  search
                })
              }
            >
              <EditIcon className={'h-3 w-3'} />
            </SubmitButton>
            <SubmitButton variant={'destructive'} className={'h-6 px-3'}>
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
      <PageHeader title={'Quản lý nhà cung cấp'} />
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
            Thêm nhà cung cấp
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
          data={listSuppliers.data?.items ?? []}
          columns={columns}
          rowCount={listSuppliers.data?.totalItems}
          pageCount={listSuppliers.data?.totalPages}
          pageIndex={search.pageIndex}
          pageSize={search.pageSize}
          onRowClick={row =>
            navigate({
              to: './$supplierId/edit',
              params: {
                supplierId: row.original.id
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

export const Route = createFileRoute('/_authenticated/general/suppliers/')({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    SuppliersSearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(supplierApi.list.getOptions(deps.search))
});
