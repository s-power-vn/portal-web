import { compile } from '@fileforge/react-print';
import type { ExpandedState } from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import _ from 'lodash';
import { PrinterIcon, SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import { api } from 'portal-api';
import {
  BASE_URL,
  TreeData,
  arrayToTree,
  client,
  getCommonPinningStyles
} from 'portal-core';
import printJS from 'print-js';

import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { cn, formatDate, formatNumber } from '@minhdtb/storeo-core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useLoading
} from '@minhdtb/storeo-theme';

import { ADMIN_ID, ProcessData } from '../../../../components';
import { RequestDocument } from './request-document';

export type RequestDetailItem = {
  id?: string;
  title: string;
  unit: string;
  group: string;
  level: string;
  requestVolume?: number;
  deliveryDate?: string;
  note?: string;
  parent?: string;
  index?: string;
  isNew?: boolean;
};

export type RequestDisplayProps = {
  issueId: string;
};

export const RequestDisplay: FC<RequestDisplayProps> = ({ issueId }) => {
  const [expanded, setExpanded] = useState<ExpandedState>(true);

  const request = api.request.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const v = useMemo<RequestDetailItem[]>(() => {
    return _.chain(
      request.data ? request.data?.expand?.requestDetail_via_request : []
    )
      .map(it => {
        const { customLevel, customUnit, customTitle } = it;

        return {
          id: it.id,
          title: it.expand?.detail.title ?? customTitle,
          unit: it.expand?.detail.unit ?? customUnit,
          group: it.expand?.detail.id ?? customLevel,
          level: it.expand?.detail.level ?? customLevel,
          requestVolume: it.requestVolume,
          deliveryDate: it.deliveryDate,
          note: it.note,
          index: it.index,
          parent: it.expand?.detail.parent ?? `${request.data?.project}-root`
        };
      })
      .orderBy('level')
      .value();
  }, [request.data]);

  const requestDetails = useMemo(() => {
    return arrayToTree(v, `${request.data?.project}-root`);
  }, [request.data?.project, v]);

  const columnHelper = createColumnHelper<TreeData<RequestDetailItem>>();

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
        cell: ({ row }) => row.original.title,
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
          <div className={'flex justify-center gap-1'}>{row.original.unit}</div>
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
              {formatNumber(row.original.requestVolume ?? 0)}
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
            {formatDate(row.original.deliveryDate ?? '')}
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
    data: requestDetails,
    columns,
    initialState: {
      columnPinning: {
        left: ['index', 'id', 'level', 'title']
      }
    },
    state: {
      expanded,
      columnVisibility: {
        unitPrice: client.authStore.record?.id === ADMIN_ID
      }
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true
  });

  const { showLoading, hideLoading } = useLoading();

  const handlePrint = useCallback(async () => {
    await import('react-dom/server');
    showLoading();
    const html = await compile(
      <RequestDocument
        project={request.data?.expand?.project.name}
        code={request.data?.expand?.issue.code}
        bidding={request.data?.expand?.project.bidding}
        requester={request.data?.expand?.issue.expand?.createdBy.name}
        department={
          request.data?.expand?.issue.expand?.createdBy.expand?.department.name
        }
        content={request.data?.expand?.issue.title}
        data={v}
        processData={
          (issue.data.expand?.object?.expand?.process?.process || {
            nodes: [],
            flows: []
          }) as ProcessData
        }
        approvers={issue.data?.approver?.map(it => ({
          userId: it.userId,
          userName: it.userName,
          nodeId: it.nodeId,
          nodeName: it.nodeName
        }))}
      />
    );
    fetch(`${BASE_URL}/pdf/create`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + client.authStore.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: html,
        pageFormat: 'A4',
        pageOrientation: 'portrait'
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
  }, [request.data, v, showLoading, hideLoading, issue.data]);

  return (
    <div className={'bg-appWhite flex flex-col gap-2 p-2'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex gap-2'}>
          <Button className={'text-appWhite'} size="icon" onClick={handlePrint}>
            <PrinterIcon className={'h-4 w-4'} />
          </Button>
        </div>
      </div>
      <div className={'border-appBlue overflow-x-auto rounded-md border pb-2'}>
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
                        width: header.getSize()
                      }}
                      className={`bg-appBlueLight text-appWhite whitespace-nowrap border-r p-1 text-center after:absolute
                          after:right-0 after:top-0 after:h-full after:border-r after:content-[''] last:border-r-0 last:after:border-r-0`}
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
                  >
                    {row.getVisibleCells().map(cell => {
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles(cell.column),
                            width: cell.column.getSize()
                          }}
                          className={cn(
                            `bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight p-1 text-xs after:absolute
                                 after:right-0 after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`
                          )}
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
    </div>
  );
};

export default RequestDisplay;
