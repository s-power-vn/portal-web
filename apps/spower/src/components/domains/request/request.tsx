import { compile } from '@fileforge/react-print';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import type {
  ExpandedState,
  Row,
  RowSelectionState
} from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import _ from 'lodash';
import {
  CalendarIcon,
  CrossIcon,
  EditIcon,
  PaperclipIcon,
  PrinterIcon,
  SquareMinusIcon,
  SquarePlusIcon
} from 'lucide-react';
import type { RequestDetailData } from 'portal-api';
import { api } from 'portal-api';
import {
  BASE_URL,
  Collections,
  IssueTypeOptions,
  RequestStatusOptions,
  client,
  getImageUrl
} from 'portal-core';
import printJS from 'print-js';

import type { FC } from 'react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import {
  Show,
  cn,
  formatDate,
  formatNumber,
  timeSince
} from '@minhdtb/storeo-core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  closeModal,
  showModal,
  useConfirm,
  useLoading
} from '@minhdtb/storeo-theme';

import type { TreeData } from '../../../commons/utils';
import { arrayToTree, getCommonPinningStyles } from '../../../commons/utils';
import { ADMIN_ID } from '../project/project-overview-tab';
import { EditRequestVolumeForm } from './edit-request-volume-form';
import { RequestAction } from './request-action';
import { RequestDocument } from './request-document';
import { DeadlineStatus } from './status/deadline-status';
import { RequestStatus } from './status/request-status';
import { RequestStatusText } from './status/request-status-text';

export type RequestProps = {
  issueId: string;
};

export const Request: FC<RequestProps> = ({ issueId }) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<RequestDetailData>>>();

  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const request = api.request.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const router = useRouter();

  const queryClient = useQueryClient();

  const deleteIssue = api.issue.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: api.issue.list.getKey({
            projectId: request.data?.project
          })
        }),
        queryClient.invalidateQueries({
          queryKey: api.issue.listMine.getKey({
            projectId: request.data?.project
          })
        }),
        queryClient.invalidateQueries({
          queryKey: api.issue.listRequest.getKey({
            projectId: request.data?.project
          })
        })
      ]);
      router.history.back();
    }
  });

  const { confirm } = useConfirm();

  const comments = api.comment.list.useSuspenseQuery({
    variables: issueId
  });

  const v = useMemo(() => {
    return _.chain(
      request.data ? request.data?.expand.requestDetail_via_request : []
    )
      .map(it => {
        return {
          ...it,
          group: it.expand?.detail.id ?? it.customLevel,
          level: it.expand?.detail.level ?? it.customLevel,
          parent: it.expand?.detail.parent ?? `${request.data?.project}-root`
        };
      })
      .orderBy('level')
      .value();
  }, [request.data]);

  const requests = useMemo(() => {
    return arrayToTree(v, `${request.data?.project}-root`);
  }, [request.data?.project, v]);

  const columnHelper = createColumnHelper<TreeData<RequestDetailData>>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('index', {
        cell: ({ row }) => {
          return <div className={'text-center'}>{row.original.index}</div>;
        },
        header: () => (
          <div className={'flex w-full items-center justify-center'}>STT</div>
        ),
        footer: info => info.column.id,
        size: 30,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div className={'flex w-full items-center justify-center'}>
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
          <div className={'flex w-full items-center justify-center'}></div>
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
        size: 40,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'title',
        cell: ({ row }) =>
          row.original.expand?.detail.title ?? row.original.customTitle,
        header: () => 'Mô tả công việc mời thầu',
        footer: info => info.column.id,
        meta: {
          hasRowSpan: 'levelRowSpan'
        },
        minSize: 300
      }),
      columnHelper.display({
        id: 'unit',
        cell: ({ row }) => (
          <div className={'flex justify-center gap-1'}>
            {row.original.expand?.detail.unit ?? row.original.customUnit}
          </div>
        ),
        header: () => 'Đơn vị tính',
        footer: info => info.column.id,
        size: 50,
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
        header: () => 'Khối lượng',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('deliveryDate', {
        cell: ({ row }) => (
          <div className={'flex justify-center gap-1'}>
            {formatDate(row.original.deliveryDate)}
          </div>
        ),
        header: () => 'Ngày cấp',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('note', {
        cell: ({ row }) => (
          <div className={'flex justify-start gap-1'}>{row.original.note}</div>
        ),
        header: () => 'Ghi chú',
        footer: info => info.column.id,
        size: 120,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: requests,
    columns,
    initialState: {
      columnPinning: {
        left: ['index', 'id', 'level', 'title']
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
          queryKey: api.request.byIssueId.getKey(issueId)
        }),
        queryClient.invalidateQueries({
          queryKey: api.requestDetail.byId.getKey(selectedRow.original.id)
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
        title: 'Sửa yêu cầu',
        className: 'min-w-60 w-[25rem]',
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
        project={request.data?.expand.project.name}
        code={request.data?.code}
        bidding={request.data?.expand.project.bidding}
        requester={request.data?.expand.issue.expand.createdBy.name}
        department={
          request.data?.expand.issue.expand.createdBy.expand.department.name
        }
        content={request.data?.expand.issue.title}
        confirm1={
          request.data?.status === RequestStatusOptions.A4F ||
          request.data?.status === RequestStatusOptions.A4R ||
          request.data?.status === RequestStatusOptions.A5F ||
          request.data?.status === RequestStatusOptions.A5R ||
          request.data?.status === RequestStatusOptions.A6F ||
          request.data?.status === RequestStatusOptions.A6R ||
          request.data?.status === RequestStatusOptions.A7F ||
          request.data?.status === RequestStatusOptions.A7R
        }
        confirm2={
          request.data?.status === RequestStatusOptions.A6F ||
          request.data?.status === RequestStatusOptions.A6R ||
          request.data?.status === RequestStatusOptions.A7F ||
          request.data?.status === RequestStatusOptions.A7R
        }
        confirm3={request.data?.status === RequestStatusOptions.A7F}
        leader1={request.data?.confirm1}
        leader2={request.data?.confirm2}
        leader3={request.data?.confirm3}
        data={v}
      />
    );
    fetch(`${BASE_URL}/create-pdf`, {
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
      })
      .finally(() => hideLoading());
  }, [request.data, v, showLoading, hideLoading]);

  return (
    <div className={'bg-appWhite flex flex-col'}>
      <div className={'flex items-center justify-between p-2'}>
        <div className={'flex gap-2'}>
          <Button className={'text-appWhite'} size="icon" onClick={handlePrint}>
            <PrinterIcon className={'h-4 w-4'} />
          </Button>
          <Show
            when={
              request.data?.expand.issue.assignee ===
                client.authStore.model?.id &&
              request.data?.status !== RequestStatusOptions.A7F
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
              <CrossIcon className={'h-4 w-4'} />
            </Button>
          </Show>
        </div>
        <div className={'flex gap-2'}>
          <DeadlineStatus
            className={'font-bold'}
            status={request.data?.expand.issue.deadlineStatus}
          />
          <RequestStatus
            className={'px-3 py-1.5 text-xs font-bold'}
            issueId={issueId}
          />
        </div>
      </div>
      <Tabs defaultValue={'detail'}>
        <TabsList className="grid w-full grid-cols-4 gap-1 rounded-none">
          <TabsTrigger value="detail" asChild>
            <div className={'cursor-pointer select-none'}>Nội dung</div>
          </TabsTrigger>
          <TabsTrigger value="attachment" asChild>
            <div className={'flex cursor-pointer select-none gap-1'}>
              <PaperclipIcon className={'h-5 w-4'}></PaperclipIcon>
              File đính kèm
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <div className={'flex flex-col gap-2 px-2'}>
            <div
              className={
                'border-appBlue overflow-x-auto rounded-md border pb-2'
              }
            >
              <Table>
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
          <div className={'flex flex-col gap-2 pt-4'}>
            <div className={'flex flex-col gap-2'}>
              {comments.data && comments.data.length > 0
                ? comments.data.map(it => (
                    <div className={'relative flex border-b p-2'} key={it.id}>
                      <div className={'flex flex-col pr-3'}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={getImageUrl(
                              Collections.User,
                              it.expand.createdBy.id,
                              it.expand.createdBy.avatar
                            )}
                          />
                          <AvatarFallback className={'text-sm'}>
                            {it.expand.createdBy.name.split(' ')[0][0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className={'flex flex-col gap-1'}>
                        <div className={'flex items-center gap-2'}>
                          <div className={'text-sm font-bold'}>
                            {it.expand.createdBy.name}
                          </div>
                          <div
                            className={
                              'flex items-center gap-1 text-xs text-gray-500'
                            }
                          >
                            <CalendarIcon className={'h-3 w-3'} />
                            {timeSince(new Date(Date.parse(it.created)))}
                          </div>
                          <Show
                            when={issue.data.type === IssueTypeOptions.Request}
                          >
                            <RequestStatusText status={it.status} />
                          </Show>
                        </div>
                        <div className={'text-sm'}>{it.content}</div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="attachment">
          <div className={'flex w-full items-center justify-center p-8'}>
            <div
              className={'flex flex-col items-center justify-center gap-4'}
            ></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
