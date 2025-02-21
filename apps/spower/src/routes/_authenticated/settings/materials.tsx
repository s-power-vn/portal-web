import { useQueryClient } from '@tanstack/react-query';
import {
  Outlet,
  SearchSchemaInput,
  createFileRoute,
  useNavigate
} from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { EditIcon, PlusIcon, XIcon } from 'lucide-react';
import { SearchSchema, api } from 'portal-api';
import type { MaterialResponse } from 'portal-core';

import {
  Button,
  CommonTable,
  DebouncedInput,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { PageHeader } from '../../../components';

export const Route = createFileRoute('/_authenticated/settings/materials')({
  component: RouteComponent,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    SearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(api.material.list.getOptions(deps.search)),
  beforeLoad: () => {
    return {
      title: 'Quản lý danh mục vật tư'
    };
  }
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const listMaterials = api.material.list.useSuspenseQuery({
    variables: search
  });

  const columnHelper = createColumnHelper<MaterialResponse>();

  const deleteMaterial = api.material.delete.useMutation({
    onSuccess: async () => {
      success('Xóa vật tư thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: api.material.list.getKey(search)
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
      header: () => <div className={'flex items-center justify-center'}>#</div>,
      size: 30
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => 'Tên vật tư',
      footer: info => info.column.id,
      size: 300
    }),
    columnHelper.accessor('code', {
      cell: info => info.getValue(),
      header: () => 'Mã vật tư',
      footer: info => info.column.id
    }),
    columnHelper.accessor('unit', {
      cell: info => info.getValue(),
      header: () => 'Đơn vị',
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
                  to: './$materialId/edit',
                  params: {
                    materialId: row.original.id
                  },
                  search
                })
              }
            >
              <EditIcon className={'h-3 w-3'} />
            </Button>
            <Button
              variant={'destructive'}
              className={'h-6 px-3'}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                confirm('Bạn chắc chắn muốn xóa vật tư này?', () => {
                  deleteMaterial.mutate(row.original.id);
                });
              }}
            >
              <XIcon className={'h-3 w-3'} />
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
      <PageHeader title={'Quản lý danh mục vật tư'} />
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
            <PlusIcon className={'h-5 w-5'} />
            Thêm vật tư
          </Button>
          <DebouncedInput
            value={search.filter}
            className={'h-9 w-56'}
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
          data={listMaterials.data?.items ?? []}
          columns={columns}
          rowCount={listMaterials.data?.totalItems}
          pageCount={listMaterials.data?.totalPages}
          pageIndex={search.pageIndex}
          pageSize={search.pageSize}
          fixedWidth={true}
          onRowClick={row =>
            navigate({
              to: './$materialId/edit',
              params: {
                materialId: row.original.id
              },
              search
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
    </>
  );
}
