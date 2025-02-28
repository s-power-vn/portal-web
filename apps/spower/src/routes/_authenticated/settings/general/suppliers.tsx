import { useQueryClient } from '@tanstack/react-query'
import type { SearchSchemaInput } from '@tanstack/react-router'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { EditIcon, PlusIcon, XIcon } from 'lucide-react'
import { ListSchema, api } from 'portal-api'
import type { SupplierResponse } from 'portal-core'

import {
  Button,
  CommonTable,
  DebouncedInput,
  success,
  useConfirm,
} from '@minhdtb/storeo-theme'

import { PageHeader } from '../../../../components'

export const Route = createFileRoute(
  '/_authenticated/settings/general/suppliers',
)({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search }
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(api.supplier.list.getOptions(deps.search)),
  beforeLoad: () => {
    return {
      title: 'Quản lý nhà cung cấp',
    }
  },
})

function Component() {
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  const listSuppliers = api.supplier.list.useSuspenseQuery({
    variables: search,
  })

  const columnHelper = createColumnHelper<SupplierResponse>()

  const deleteSupplier = api.supplier.delete.useMutation({
    onSuccess: async () => {
      success('Xóa nhà cung cấp thành công')
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: api.supplier.list.getKey(search),
        }),
      ])
    },
  })

  const { confirm } = useConfirm()

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: (info) => (
        <div className={'flex items-center justify-center'}>
          {info.row.index + 1}
        </div>
      ),
      header: () => <div className={'flex items-center justify-center'}>#</div>,
      size: 30,
    }),
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: () => 'Tên nhà cung cấp',
      footer: (info) => info.column.id,
      size: 300,
    }),
    columnHelper.accessor('phone', {
      cell: (info) => info.getValue(),
      header: () => 'Số điện thoại',
      footer: (info) => info.column.id,
      size: 150,
    }),
    columnHelper.accessor('email', {
      cell: (info) => info.getValue(),
      header: () => 'Email',
      footer: (info) => info.column.id,
      size: 200,
    }),
    columnHelper.accessor('address', {
      cell: (info) => info.getValue(),
      header: () => 'Địa chỉ',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('note', {
      cell: (info) => info.getValue(),
      header: () => 'Ghi chú',
      footer: (info) => info.column.id,
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
                    supplierId: row.original.id,
                  },
                  search,
                })
              }
            >
              <EditIcon className={'h-3 w-3'} />
            </Button>
            <Button
              variant={'destructive'}
              className={'h-6 px-3'}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                confirm('Bạn chắc chắn muốn xóa nhà cung cấp này?', () => {
                  deleteSupplier.mutate(row.original.id)
                })
              }}
            >
              <XIcon className={'h-3 w-3'} />
            </Button>
          </div>
        )
      },
      header: () => 'Thao tác',
    }),
  ]

  return (
    <>
      <Outlet />
      <PageHeader title={'Quản lý nhà cung cấp'} />
      <div className={'flex flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <Button
            className={'flex gap-1'}
            onClick={() =>
              navigate({
                to: './new',
                search,
              })
            }
          >
            <PlusIcon className={'h-5 w-5'} />
            Thêm nhà cung cấp
          </Button>
          <DebouncedInput
            value={search.filter}
            className={'h-9 w-56'}
            placeholder={'Tìm kiếm...'}
            onChange={(value) =>
              navigate({
                to: '.',
                search: {
                  ...search,
                  filter: value ?? '',
                },
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
          fixedWidth={true}
          onRowClick={(row) =>
            navigate({
              to: './$supplierId/edit',
              params: {
                supplierId: row.original.id,
              },
              search,
            })
          }
          onPageNext={() =>
            navigate({
              to: '.',
              search: (prev) => {
                return { ...prev, pageIndex: prev.pageIndex + 1 }
              },
            })
          }
          onPagePrev={() =>
            navigate({
              to: '.',
              search: (prev) => {
                return { ...prev, pageIndex: prev.pageIndex - 1 }
              },
            })
          }
          onPageSizeChange={(pageSize) =>
            navigate({
              to: '.',
              search: {
                ...search,
                pageSize,
              },
            })
          }
        ></CommonTable>
      </div>
    </>
  )
}
