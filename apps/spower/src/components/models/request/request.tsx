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
import { PrinterIcon, SquareMinusIcon, SquarePlusIcon } from 'lucide-react';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Show, client, cn, formatCurrency, formatNumber } from '@storeo/core';
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

import {
  RequestDetailData,
  requestApi,
  requestDetailApi,
  settingApi
} from '../../../api';
import {
  TreeData,
  arrayToTree,
  getCommonPinningStyles
} from '../../../commons/utils';
import { EditRequestPriceForm } from './edit-request-price-form';
import { EditRequestVolumeForm } from './edit-request-volume-form';
import { ListRequestSupplierDialog } from './list-request-supplier-dialog';
import { RequestAction } from './request-action';
import { RequestStatus } from './request-status';

export type RequestProps = {
  issueId: string;
};

export const Request: FC<RequestProps> = ({ issueId }) => {
  const [openListSupplier, setOpenListSupplier] = useState(false);

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<RequestDetailData>>>();

  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const listApprovers = settingApi.listApprover.useSuspenseQuery();

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
          parent: it.expand.detail.parent
        };
      })
      .value();

    return arrayToTree(v, `${request.data.project}-root`);
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
      columnHelper.accessor('price', {
        cell: ({ row }) => (
          <Show when={row.original.price}>
            <div className={'flex justify-end gap-1'}>
              <span className={'font-semibold'}>
                {row.original.price && formatCurrency(row.original.price)}
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
          if (row.original.price) {
            const exceed =
              row.original.price - row.original.expand.detail.unitPrice;
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
      columnHelper.display({
        id: 'supplier',
        cell: info => info.row.original.expand.supplier?.name,
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

  const approveRequest = requestApi.approve.useMutation({
    onSuccess: async () => {
      success('Yêu cầu đã được duyệt');
      router.history.back();
    }
  });

  const rejectRequest = requestApi.reject.useMutation({
    onSuccess: async () => {
      success('Yêu cầu đã bị từ chối');
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

  const handleEditRequestPrice = useCallback(() => {
    if (selectedRow) {
      modalId.current = showModal({
        title: 'Thay đổi đơn giá',
        className: 'w-80',
        children: (
          <EditRequestPriceForm
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
            <Button className={'text-appWhite'} size="icon">
              <PrinterIcon className={'h-4 w-4'} />
            </Button>
          </div>
          <div className={'flex gap-2'}>
            <Show
              when={
                client.authStore.model?.role === 1 &&
                client.authStore.model?.id ===
                  request.data.expand.issue.assignee
              }
            >
              <div className={'flex gap-2'}>
                <Button
                  className={'bg-blue-500 hover:bg-blue-600'}
                  onClick={() =>
                    confirm('Bạn có chắc chắn muốn duyệt yêu cầu này?', () =>
                      approveRequest.mutate(request.data)
                    )
                  }
                >
                  Phê duyệt
                </Button>
                <Button
                  className={'bg-red-500 hover:bg-red-600'}
                  onClick={() =>
                    confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?', () =>
                      rejectRequest.mutate(request.data)
                    )
                  }
                >
                  Từ chối
                </Button>
              </div>
            </Show>
            <RequestStatus
              className={'px-3 py-1.5 text-xs font-bold'}
              issueId={issueId}
            />
          </div>
        </div>
        <div className={'flex flex-col gap-2'}>
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
                          className={`bg-appBlueLight text-appWhite whitespace-nowrap p-1 text-center after:absolute
                          after:right-0 after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`}
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
          <RequestAction issueId={issueId} />
        </div>
      </div>
    </>
  );
};
