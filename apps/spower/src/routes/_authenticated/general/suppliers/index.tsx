import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { EditIcon, SheetIcon } from 'lucide-react';
import { InferType, number, object, string } from 'yup';

import { SupplierResponse, client } from '@storeo/core';
import { Button, CommonTable, DebouncedInput } from '@storeo/theme';

const suppliersSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type SuppliersSearch = InferType<typeof suppliersSearchSchema>;

function getSuppliersOptions(search: SuppliersSearch) {
  return queryOptions({
    queryKey: ['getSuppliers', search],
    queryFn: () => {
      const filter = `(name ~ "${search.filter ?? ''}" || email ~ "${search.filter ?? ''}")`;
      return client
        .collection<SupplierResponse>('supplier')
        .getList(search.pageIndex, search.pageSize, {
          filter,
          sort: '-created'
        });
    }
  });
}

const Component = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const suppliers = useSuspenseQuery(getSuppliersOptions(search));

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
            <Button
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
            </Button>
            <Button variant={'destructive'} className={'h-6 px-3'}>
              <Cross2Icon className={'h-3 w-3'} />
            </Button>
          </div>
        );
      },
      header: () => 'Thao tác'
    })
  ];

  return (
    <>
      <Outlet />
      <div className={'flex flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <Button
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
          </Button>
          <Button
            variant={'outline'}
            className={'flex gap-1'}
            onClick={() =>
              navigate({
                to: './new',
                search
              })
            }
          >
            <SheetIcon />
            Nhập từ Excel
          </Button>
        </div>
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
          data={suppliers.data?.items ?? []}
          columns={columns}
          rowCount={suppliers.data?.totalItems}
          pageCount={suppliers.data?.totalPages}
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
        ></CommonTable>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_authenticated/general/suppliers/')({
  component: Component,
  validateSearch: (search?: Record<string, unknown>) =>
    suppliersSearchSchema.validateSync(search),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(getSuppliersOptions(deps.search))
});
