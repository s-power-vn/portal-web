import { compile } from '@fileforge/react-print';
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
  SquarePlusIcon
} from 'lucide-react';
import printJS from 'print-js';

import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

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
  useConfirm,
  useLoading
} from '@storeo/theme';

import { RequestDetailData, requestApi, requestDetailApi } from '../../../api';
import { issueApi } from '../../../api/issue';
import {
  TreeData,
  arrayToTree,
  getCommonPinningStyles
} from '../../../commons/utils';
import { ADMIN_ID } from '../project/project-overview-tab';
import { EditRequestVolumeForm } from './edit-request-volume-form';
import { RequestAction } from './request-action';
import { RequestDocument } from './request-document';
import { DeadlineStatus } from './status/deadline-status';
import { RequestStatus } from './status/request-status';

export type RequestProps = {
  issueId: string;
};

export const Request: FC<RequestProps> = ({ issueId }) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<RequestDetailData>>>();

  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const router = useRouter();

  const queryClient = useQueryClient();

  const deleteIssue = issueApi.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueApi.list.getKey({
            projectId: request.data.project
          })
        }),
        queryClient.invalidateQueries({
          queryKey: issueApi.listMine.getKey({
            projectId: request.data.project
          })
        })
      ]);
      router.history.back();
    }
  });

  const { confirm } = useConfirm();

  const v = useMemo(() => {
    return _.chain(
      request.data ? request.data.expand.requestDetail_via_request : []
    )
      .map(it => {
        return {
          ...it,
          group: it.expand?.detail.id ?? it.customLevel,
          level: it.expand?.detail.level ?? it.customLevel,
          parent: it.expand?.detail.parent ?? `${request.data.project}-root`
        };
      })
      .orderBy('level')
      .value();
  }, [request.data]);

  const requests = useMemo(() => {
    return arrayToTree(v, `${request.data.project}-root`);
  }, [request.data.project, v]);

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
        cell: ({ row }) =>
          row.original.expand?.detail.title ?? row.original.customTitle,
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
          <Show when={row.original.expand?.detail.volume}>
            <div className={'flex justify-end gap-1'}>
              <span className={'font-semibold'}>
                {formatNumber(row.original.expand?.detail.volume)}
              </span>
            </div>
          </Show>
        ),
        header: () => 'Khối lượng HĐ',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'unit',
        cell: ({ row }) => (
          <div className={'flex justify-center gap-1'}>
            {row.original.expand?.detail.unit ?? row.original.customUnit}
          </div>
        ),
        header: () => 'Đơn vị',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'unitPrice',
        cell: ({ row }) => (
          <Show when={row.original.expand?.detail.unitPrice}>
            <div className={'flex justify-end'}>
              <span className={'font-semibold'}>
                {formatCurrency(row.original.expand?.detail.unitPrice)}
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
        cell: info => info.row.original.expand?.supplier?.name,
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
      rowSelection,
      columnVisibility: {
        unitPrice: client.authStore.model?.id === ADMIN_ID
      }
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

  const modalId = useRef<string | undefined>();

  const onSuccessHandler = useCallback(async () => {
    if (selectedRow) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.byIssueId.getKey(issueId)
        }),
        queryClient.invalidateQueries({
          queryKey: requestDetailApi.byId.getKey(selectedRow.original.id)
        })
      ]);
    }
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, [issueId, queryClient, selectedRow]);

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleEditRequestVolume = useCallback(() => {
    if (selectedRow) {
      modalId.current = showModal({
        title: 'Sửa khối lượng',
        className: 'w-80',
        children: (
          <EditRequestVolumeForm
            requestDetailId={selectedRow.original.id}
            onSuccess={onSuccessHandler}
            onCancel={onCancelHandler}
          />
        )
      });
    }
  }, [onCancelHandler, onSuccessHandler, selectedRow]);

  const { showLoading, hideLoading } = useLoading();

  const handlePrint = useCallback(async () => {
    await import('react-dom/server');
    showLoading();
    const html = await compile(
      <RequestDocument
        project={request.data.expand.project.name}
        bidding={request.data.expand.project.bidding}
        requester={request.data.expand.issue.expand.createdBy.name}
        department={
          request.data.expand.issue.expand.createdBy.expand.department.name
        }
        content={request.data.expand.issue.title}
        data={v}
      />
    );
    fetch('http://localhost:8090/create-pdf', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + client.authStore.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: html
      })
    })
      .then(response => response.blob())
      .then(blob => {
        printJS({
          printable: URL.createObjectURL(blob),
          type: 'pdf'
        });
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = 'test.pdf';
        // link.click();
      })
      .finally(() => hideLoading());
  }, [request.data, v, showLoading, hideLoading]);

  return (
    <div className={'bg-appWhite flex flex-col gap-3'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex gap-2'}>
          <Button className={'text-appWhite'} size="icon" onClick={handlePrint}>
            <PrinterIcon className={'h-4 w-4'} />
          </Button>
          <Show
            when={
              request.data.expand.issue.assignee === client.authStore.model?.id
            }
          >
            <Button
              className={'text-appWhite'}
              size="icon"
              disabled={!selectedRow}
              onClick={handleEditRequestVolume}
            >
              <EditIcon className={'h-4 w-4'} />
            </Button>
            <Button
              variant={'destructive'}
              size="icon"
              onClick={() => {
                confirm?.('Bạn chắc chắn muốn xóa yêu cầu mua hàng này?', () =>
                  deleteIssue.mutate(issueId)
                );
              }}
            >
              <Cross2Icon className={'h-4 w-4'} />
            </Button>
          </Show>
        </div>
        <div className={'flex gap-2'}>
          <DeadlineStatus
            className={'font-bold'}
            status={request.data.expand.issue.deadlineStatus}
          />
          <RequestStatus
            className={'px-3 py-1.5 text-xs font-bold'}
            issueId={issueId}
          />
        </div>
      </div>
      <div>
        {/*<RequestDocument*/}
        {/*  project={request.data.expand.project.name}*/}
        {/*  bidding={request.data.expand.project.bidding}*/}
        {/*  requester={request.data.expand.issue.expand.createdBy.name}*/}
        {/*  department={*/}
        {/*    request.data.expand.issue.expand.createdBy.expand.department.name*/}
        {/*  }*/}
        {/*  content={request.data.expand.issue.title}*/}
        {/*  data={v}*/}
        {/*/>*/}
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
                  <TableCell colSpan={columns.length} className={'text-center'}>
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
  );
};
