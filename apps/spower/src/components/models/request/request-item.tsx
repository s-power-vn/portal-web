import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import {
  ExpandedState,
  Row,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import _ from 'lodash';
import {
  EditIcon,
  PrinterIcon,
  SquareMinusIcon,
  SquarePlusIcon,
  StoreIcon
} from 'lucide-react';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Match,
  RequestStatusOptions,
  Show,
  Switch,
  client,
  cn,
  formatCurrency,
  formatNumber
} from '@storeo/core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  closeModal,
  showModal,
  success,
  useConfirm
} from '@storeo/theme';

import { RequestDetailData, requestApi, requestDetailApi } from '../../../api';
import {
  TreeData,
  arrayToTree,
  getCommonPinningStyles
} from '../../../commons/utils';
import { EditRequestVolumeForm } from '../request-detail/edit-request-volume-form';
import { ListRequestSupplierDialog } from '../request-detail/list-request-supplier-dialog';

export type RequestItemProps = {
  requestId: string;
};

export const RequestItem: FC<RequestItemProps> = ({ requestId }) => {
  const [openListSupplier, setOpenListSupplier] = useState(false);

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<RequestDetailData>>>();

  const request = requestApi.byId.useSuspenseQuery({
    variables: requestId
  });

  const router = useRouter();

  const queryClient = useQueryClient();

  const deleteRequest = requestApi.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.listFull.getKey(request.data.project)
        })
      ]);
      router.history.back();
    }
  });

  const requests = useMemo(() => {
    const v = _.chain(
      request.data ? request.data.expand.requestDetail_via_request : []
    )
      .map(it => {
        return {
          ...it,
          group: it.expand.detail.id,
          level: it.expand.detail.level,
          parent: it.expand.detail.parent,
          suppliers: it.expand.requestDetailSupplier_via_requestDetail?.map(
            st => {
              return {
                id: st.expand.supplier.id,
                name: st.expand.supplier.name,
                price: st.price,
                volume: st.volume
              };
            }
          )
        };
      })
      .value();

    const list = [];
    for (const vi of v) {
      if (vi.suppliers?.length > 0) {
        let index = 0;
        for (const s of vi.suppliers) {
          list.push({
            ..._.omit(vi, ['suppliers']),
            supplier: s.id,
            supplierUnitPrice: s.price,
            supplierName: s.name,
            supplierVolume: s.volume,
            rowSpan: index === 0 ? vi.suppliers.length : 0
          });
          index++;
        }
      } else {
        list.push({ ..._.omit(vi, ['suppliers']) });
      }
    }

    return arrayToTree(list, `${request.data.project}-root`);
  }, [request.data]);

  const columnHelper = createColumnHelper<TreeData<RequestDetailData>>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div className={'flex w-full items-center '}>
              {row.getCanExpand() ? (
                <button
                  className={'cursor-pointer'}
                  onClick={e => {
                    e.stopPropagation();
                    row.toggleExpanded();
                  }}
                >
                  {row.getIsExpanded() ? (
                    <SquareMinusIcon width={18} height={18} />
                  ) : (
                    <SquarePlusIcon width={18} height={18} />
                  )}
                </button>
              ) : null}
            </div>
          );
        },
        header: () => (
          <div className={'flex w-full items-center justify-center'}>#</div>
        ),
        footer: info => info.column.id,
        size: 30,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'level',
        cell: ({ row }) => row.original.level,
        header: () => (
          <div className={'flex w-full items-center justify-center'}>ID</div>
        ),
        footer: info => info.column.id,
        size: 50,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'title',
        cell: ({ row }) => row.original.expand.detail.title,
        header: () => 'Mô tả công việc',
        footer: info => info.column.id,
        size: 300,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'volume',
        cell: ({ row }) => (
          <div className={'flex justify-end gap-1'}>
            <span className={'font-semibold'}>
              {formatNumber(row.original.expand.detail.volume)}
            </span>
            <span>{row.original.expand.detail.unit}</span>
          </div>
        ),
        header: () => 'Khối lượng HĐ',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'unitPrice',
        cell: ({ row }) => (
          <Show when={row.original.expand.detail.unitPrice}>
            <div className={'flex justify-end'}>
              <span className={'font-semibold'}>
                {formatCurrency(row.original.expand.detail.unitPrice)}
              </span>
              <span>₫</span>
            </div>
          </Show>
        ),
        header: () => 'Đơn giá HĐ',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'requestVolume',
        cell: ({ row }) => (
          <div className={'flex justify-end gap-1'}>
            <span className={'font-semibold'}>
              {formatNumber(row.original.volume)}
            </span>
            <span>{row.original.expand.detail.unit}</span>
          </div>
        ),
        header: () => 'Khối lượng yêu cầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('supplierUnitPrice', {
        cell: ({ row }) => (
          <Show when={row.original.supplierUnitPrice}>
            <div className={'flex justify-end gap-1'}>
              <span className={'font-semibold'}>
                {row.original.supplierUnitPrice &&
                  formatCurrency(row.original.supplierUnitPrice)}
              </span>
              <span>₫</span>
            </div>
          </Show>
        ),
        header: () => 'Đơn giá NCC',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'exceedUnitPrice',
        cell: ({ row }) => {
          if (row.original.supplierUnitPrice) {
            const exceed =
              row.original.supplierUnitPrice -
              row.original.expand.detail.unitPrice;
            if (exceed > 0) {
              return (
                <div className={'flex justify-end text-red-500'}>
                  <span className={'font-semibold'}>
                    {formatCurrency(exceed)}
                  </span>
                  <span>₫</span>
                </div>
              );
            } else {
              return (
                <div className={'flex justify-end text-green-500'}>
                  <span className={'font-semibold'}>
                    {formatCurrency(-exceed)}
                  </span>
                  <span>₫</span>
                </div>
              );
            }
          }
          return null;
        },
        header: () => 'Đơn giá phát sinh',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('supplierVolume', {
        cell: ({ row }) =>
          row.original.supplierVolume ? (
            <div className={'flex justify-end gap-1'}>
              <span className={'font-semibold'}>
                {formatNumber(row.original.supplierVolume)}
              </span>
              <span>{row.original.expand.detail.unit}</span>
            </div>
          ) : null,
        header: () => 'Khối lượng NCC',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('supplierName', {
        cell: info => info.getValue(),
        header: () => 'Nhà cung cấp',
        footer: info => info.column.id,
        size: 300
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: requests,
    columns,
    initialState: {
      columnPinning: {
        left: ['id', 'level', 'title']
      }
    },
    state: {
      expanded,
      rowSelection
    },
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true
  });

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

  const { confirm } = useConfirm();

  const confirmStatus = requestApi.checkConfirmer.useSuspenseQuery({
    variables: requestId
  });

  const confirmRequest = requestApi.confirm.useMutation({
    onSuccess: async () => {
      success('Xác nhận thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.checkEnableApprove.getKey()
        }),
        queryClient.invalidateQueries({
          queryKey: requestApi.checkConfirmer.getKey()
        })
      ]);
    }
  });

  const unConfirmRequest = requestApi.unConfirm.useMutation({
    onSuccess: async () => {
      success('Hủy xác nhận thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.checkEnableApprove.getKey()
        }),
        queryClient.invalidateQueries({
          queryKey: requestApi.checkConfirmer.getKey()
        })
      ]);
    }
  });

  const checkEnableApprove = requestApi.checkEnableApprove.useSuspenseQuery({
    variables: requestId
  });

  const sendToApprover = requestApi.sendToApprover.useMutation({
    onSuccess: async () => {
      success('Gửi yêu cầu phê duyệt thành công');
      router.history.back();
    }
  });

  const modalId = useRef<string | undefined>();

  const onSuccessHandler = useCallback(async () => {
    if (selectedRow) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestDetailApi.byId.getKey(selectedRow.original.id)
        })
      ]);
    }
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, [queryClient, selectedRow]);

  const handleEditRequestVolume = useCallback(() => {
    if (selectedRow) {
      modalId.current = showModal({
        title: 'Sửa khối lượng',
        className: 'w-80',
        children: (
          <EditRequestVolumeForm
            requestDetailId={selectedRow.original.id}
            onSuccess={onSuccessHandler}
          />
        )
      });
    }
  }, [onSuccessHandler, selectedRow]);

  return (
    <>
      {table.getSelectedRowModel() &&
      table.getSelectedRowModel().flatRows.length > 0 ? (
        <ListRequestSupplierDialog
          requestDetail={table.getSelectedRowModel().flatRows[0].original}
          open={openListSupplier}
          setOpen={setOpenListSupplier}
        />
      ) : null}
      <div className={'bg-appWhite flex flex-col gap-3'}>
        <div className={'flex items-center justify-between'}>
          <div className={'flex gap-2'}>
            {request.data.status === RequestStatusOptions.VolumeDone &&
            client.authStore.model?.role !== 1 ? (
              <Button
                disabled={
                  !(
                    table.getSelectedRowModel().flatRows.length > 0 &&
                    table.getSelectedRowModel().flatRows[0].original.children
                      ?.length === 0
                  )
                }
                className={'flex gap-1'}
                onClick={() => setOpenListSupplier(true)}
              >
                <StoreIcon className={'h-5 w-5'} />
                Nhà cung cấp (NCC)
              </Button>
            ) : null}
            <Button className={'text-appWhite'} size="icon">
              <PrinterIcon className={'h-4 w-4'} />
            </Button>
            <Show
              when={
                request.data.expand.issue.expand.assignee.id ===
                client.authStore.model?.id
              }
            >
              <Show when={request.data.status === RequestStatusOptions.ToDo}>
                <Button
                  className={'text-appWhite'}
                  size="icon"
                  disabled={!selectedRow}
                  onClick={handleEditRequestVolume}
                >
                  <EditIcon className={'h-4 w-4'} />
                </Button>
              </Show>
              <Button
                className={'text-appWhite bg-red-500 hover:bg-red-600'}
                size="icon"
                onClick={() => {
                  confirm?.(
                    'Bạn chắc chắn muốn xóa yêu cầu mua hàng này?',
                    () => deleteRequest.mutate(requestId)
                  );
                }}
              >
                <Cross2Icon className={'h-4 w-4'} />
              </Button>
              <Show when={!confirmStatus.isPending}>
                <Switch fallback={<div></div>}>
                  <Match when={confirmStatus.data === 1}>
                    <Button
                      className={'text-appWhite'}
                      onClick={() =>
                        confirm(
                          'Bạn chắc chắn muốn xác nhận yêu cầu mua hàng này?',
                          () => confirmRequest.mutate(requestId)
                        )
                      }
                    >
                      Xác nhận
                    </Button>
                  </Match>
                  <Match when={confirmStatus.data === 2}>
                    <Button
                      variant={'outline'}
                      onClick={() =>
                        confirm(
                          'Bạn chắc chắn muốn hủy xác nhận yêu cầu mua hàng này?',
                          () => unConfirmRequest.mutate(requestId)
                        )
                      }
                    >
                      Hủy xác nhận
                    </Button>
                  </Match>
                </Switch>
              </Show>
              <Show
                when={!checkEnableApprove.isPending && checkEnableApprove.data}
              >
                <Button
                  className={'text-appWhite'}
                  onClick={() =>
                    confirm(
                      'Bạn chắc chắn muốn gửi phê duyệt yêu cầu mua hàng này?',
                      () => sendToApprover.mutate(requestId)
                    )
                  }
                >
                  Gửi phê duyệt
                </Button>
              </Show>
            </Show>
          </div>
        </div>
        <div className={'flex flex-col'}>
          <div
            className={'border-appBlue overflow-x-auto rounded-md border pb-2'}
          >
            <Table
              style={{
                width: table.getTotalSize()
              }}
            >
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            ...getCommonPinningStyles(header.column),
                            width: header.getSize()
                          }}
                          className={`bg-appBlueLight text-appWhite whitespace-nowrap p-1 after:absolute after:right-0
                          after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`}
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => {
                    return (
                      <TableRow
                        key={row.id}
                        className={'group w-full cursor-pointer'}
                        onClick={() => {
                          setRowSelection(() => {
                            const object: Record<string, boolean> = {};
                            object[row.id] = true;
                            return object;
                          });

                          if (
                            selectedRow?.id !== row.id &&
                            row.original.children &&
                            row.original.children.length === 0
                          ) {
                            setSelectedRow(row);
                          } else {
                            setSelectedRow(undefined);
                          }
                        }}
                      >
                        {row.getVisibleCells().map(cell => {
                          return cell.column.columnDef.meta?.hasRowSpan &&
                            !cell.row.original[
                              cell.column.columnDef.meta?.hasRowSpan
                            ] ? null : (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(cell.column),
                                width: cell.column.getSize()
                              }}
                              className={cn(
                                `bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight p-1 text-xs after:absolute
                                 after:right-0 after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`,
                                selectedRow?.original.id === row.original.id
                                  ? 'bg-appBlueLight text-appWhite hover:bg-appBlue group-hover:bg-appBlue'
                                  : null
                              )}
                              rowSpan={
                                cell.column.columnDef.meta?.hasRowSpan
                                  ? cell.row.original[
                                      cell.column.columnDef.meta?.hasRowSpan
                                    ]
                                  : undefined
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className={'text-center'}
                    >
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
