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

import { MaterialResponse } from '@storeo/core';
import {
  CommonTable,
  DebouncedInput,
  SubmitButton,
  success,
  useConfirm
} from '@storeo/theme';

import { MaterialsSearchSchema, materialApi } from '../../../../api';
import { PageHeader } from '../../../../components';

const Component = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const listMaterials = materialApi.list.useSuspenseQuery({
    variables: search
  });

  const columnHelper = createColumnHelper<MaterialResponse>();

  const deleteMaterial = materialApi.delete.useMutation({
    onSuccess: async () => {
      success('Xóa vật tư thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: materialApi.list.getKey(search)
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
    columnHelper.accessor('code', {
      cell: info => info.getValue(),
      header: () => 'Mã vật tư',
      footer: info => info.column.id
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => 'Tên vật tư',
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
            <SubmitButton
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
            </SubmitButton>
            <SubmitButton
              variant={'destructive'}
              className={'h-6 px-3'}
              onClick={() => {
                confirm('Bạn chắc chắn muốn xóa vật tư này?', () => {
                  deleteMaterial.mutate(row.original.id);
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
      <PageHeader title={'Quản lý danh mục vật tư'} />
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
            Thêm vật tư
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
          data={listMaterials.data?.items ?? []}
          columns={columns}
          rowCount={listMaterials.data?.totalItems}
          pageCount={listMaterials.data?.totalPages}
          pageIndex={search.pageIndex}
          pageSize={search.pageSize}
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

export const Route = createFileRoute('/_authenticated/general/materials/')({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    MaterialsSearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(materialApi.list.getOptions(deps.search))
});
