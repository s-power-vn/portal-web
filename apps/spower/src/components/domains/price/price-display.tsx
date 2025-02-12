import { compile } from '@fileforge/react-print';
import type { ExpandedState } from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import _ from 'lodash';
import { DownloadIcon, PaperclipIcon, PrinterIcon } from 'lucide-react';
import { api } from 'portal-api';
import type {
  IssueResponse,
  PriceResponse,
  ProjectResponse,
  UserResponse
} from 'portal-core';
import { BASE_URL, client } from 'portal-core';
import printJS from 'print-js';

import { type FC, useCallback, useMemo, useState } from 'react';

import { cn, formatNumber } from '@minhdtb/storeo-core';
import {
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
  useLoading
} from '@minhdtb/storeo-theme';

import { formatFileSize, getFileIcon } from '../../../commons';
import { PriceDocument } from './price-document';

export type PriceDetailItem = {
  id?: string;
  title: string;
  unit: string;
  level: string;
  volume?: number;
  estimatePrice?: number | '';
  estimateAmount?: number | '';
  index?: string;
  prices?: Record<string, number>;
  totals: Record<string, number>;
  isSubTotal?: boolean;
  isVAT?: boolean;
  isFinalTotal?: boolean;
};

export type PriceData = PriceResponse & {
  expand: {
    project: ProjectResponse;
    issue: IssueResponse & {
      expand: {
        createdBy: UserResponse & {
          expand: {
            department: {
              name: string;
            };
          };
        };
      };
    };
    priceDetail_via_price: PriceDetailItem[];
  };
};

export type PriceDisplayProps = {
  issueId: string;
};

export const PriceDisplay: FC<PriceDisplayProps> = ({ issueId }) => {
  const [expanded, setExpanded] = useState<ExpandedState>(true);

  const price = api.price.byIssueId.useSuspenseQuery({
    variables: issueId
  }) as { data: PriceData | null };

  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const supplierIds = useMemo(
    () =>
      _.uniq(
        price.data?.expand.priceDetail_via_price?.flatMap(item =>
          Object.keys(item.prices || {})
        ) ?? []
      ),
    [price.data]
  );

  const { data: suppliers = [] } = api.supplier.listByIds.useSuspenseQuery({
    variables: supplierIds
  });

  const v = useMemo<PriceDetailItem[]>(() => {
    return _.chain(price.data ? price.data?.expand.priceDetail_via_price : [])
      .map(it => ({
        id: it.id,
        title: it.title,
        unit: it.unit,
        level: it.level,
        volume: it.volume,
        estimatePrice: it.estimatePrice,
        estimateAmount: it.estimateAmount,
        index: it.index,
        prices: it.prices as Record<string, number>,
        totals: Object.keys(it.prices || {}).reduce(
          (acc, key) => ({ ...acc, [key]: 0 }),
          {} as Record<string, number>
        )
      }))
      .orderBy('level')
      .value();
  }, [price.data]);

  const calculateTotals = useCallback(
    (data: PriceDetailItem[], suppliers: string[]) => {
      const regularRows = data
        .filter(row => !row.isSubTotal && !row.isVAT && !row.isFinalTotal)
        .map(row => ({
          ...row,
          totals: suppliers.reduce<Record<string, number>>(
            (acc, supplier) => ({
              ...acc,
              [supplier]: (row.prices?.[supplier] ?? 0) * (row.volume ?? 0)
            }),
            {}
          )
        }));

      const calculateSum = (values: number[]) => {
        const sum = values.reduce((acc, val) => acc + val, 0);
        return isNaN(sum) ? 0 : sum;
      };

      const subTotal: PriceDetailItem = {
        title: 'Tổng cộng trước thuế',
        unit: '',
        level: '',
        volume: 0,
        estimatePrice: '',
        estimateAmount: calculateSum(
          regularRows.map(row => {
            const amount = row.estimateAmount;
            return typeof amount === 'number' ? amount : 0;
          })
        ),
        prices: {},
        totals: suppliers.reduce<Record<string, number>>(
          (acc, supplier) => ({
            ...acc,
            [supplier]: calculateSum(
              regularRows.map(row => row.totals[supplier] ?? 0)
            )
          }),
          {}
        ),
        isSubTotal: true
      };

      const vat: PriceDetailItem = {
        title: 'Thuế VAT 10%',
        unit: '',
        level: '',
        volume: 0,
        estimatePrice: '',
        estimateAmount:
          typeof subTotal.estimateAmount === 'number'
            ? subTotal.estimateAmount * 0.1
            : 0,
        prices: {},
        totals: suppliers.reduce<Record<string, number>>(
          (acc, supplier) => ({
            ...acc,
            [supplier]: subTotal.totals[supplier] * 0.1
          }),
          {}
        ),
        isVAT: true
      };

      const finalTotal: PriceDetailItem = {
        title: 'Giá trị sau thuế',
        unit: '',
        level: '',
        volume: 0,
        estimatePrice: '',
        estimateAmount:
          typeof subTotal.estimateAmount === 'number' &&
          typeof vat.estimateAmount === 'number'
            ? subTotal.estimateAmount + vat.estimateAmount
            : 0,
        prices: {},
        totals: suppliers.reduce<Record<string, number>>(
          (acc, supplier) => ({
            ...acc,
            [supplier]: subTotal.totals[supplier] + vat.totals[supplier]
          }),
          {}
        ),
        isFinalTotal: true
      };

      return [...regularRows, subTotal, vat, finalTotal];
    },
    []
  );

  const priceDetails = useMemo(() => {
    return calculateTotals(v, supplierIds);
  }, [v, calculateTotals, supplierIds]);

  const columnHelper = createColumnHelper<PriceDetailItem>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('index', {
        cell: info => {
          return <div className={'text-center'}>{info.getValue()}</div>;
        },
        header: () => (
          <div className={'flex w-full items-center justify-center'}>STT</div>
        ),
        size: 30
      }),
      columnHelper.accessor('level', {
        cell: info => info.getValue(),
        header: () => (
          <div className={'flex w-full items-center justify-center'}>ID</div>
        ),
        size: 40
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc mời thầu',
        minSize: 300
      }),
      columnHelper.accessor('volume', {
        cell: info => (
          <div className={'flex justify-end gap-1'}>
            {formatNumber(info.getValue() ?? 0)}
          </div>
        ),
        header: () => 'Khối lượng',
        size: 100
      }),
      columnHelper.accessor('unit', {
        cell: info => (
          <div className={'flex justify-center gap-1'}>{info.getValue()}</div>
        ),
        header: () => 'Đơn vị tính',
        size: 50
      }),
      columnHelper.group({
        id: 'prices',
        header: () => 'Đơn giá',
        columns: [
          columnHelper.accessor('estimatePrice', {
            header: () => 'Dự toán',
            cell: info => (
              <div className={'flex justify-end gap-1'}>
                {formatNumber(info.getValue() ?? 0)}
              </div>
            ),
            size: 100
          }),
          ...suppliers!.map(supplier =>
            columnHelper.accessor(row => row.prices?.[supplier.id], {
              id: `price-${supplier.id}`,
              header: () => supplier.name,
              cell: info => (
                <div className={'flex justify-end gap-1'}>
                  {formatNumber(info.getValue() ?? 0)}
                </div>
              ),
              size: 120
            })
          )
        ]
      }),
      columnHelper.group({
        id: 'totals',
        header: () => 'Thành tiền',
        columns: [
          columnHelper.accessor('estimateAmount', {
            header: () => 'Dự toán',
            cell: info => (
              <div className={'flex justify-end gap-1'}>
                {formatNumber(info.getValue() ?? 0)}
              </div>
            ),
            size: 100
          }),
          ...suppliers!.map(supplier =>
            columnHelper.accessor(row => row.totals?.[supplier.id], {
              id: `total-${supplier.id}`,
              header: () => supplier.name,
              cell: info => (
                <div className={'flex justify-end gap-1'}>
                  {formatNumber(info.getValue() ?? 0)}
                </div>
              ),
              size: 120
            })
          )
        ]
      })
    ],
    [columnHelper, suppliers]
  );

  const table = useReactTable({
    data: priceDetails,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true
  });

  const { showLoading, hideLoading } = useLoading();

  const handlePrint = useCallback(async () => {
    await import('react-dom/server');
    showLoading();
    const html = await compile(
      <PriceDocument
        project={price.data?.expand?.project?.name}
        code={price.data?.expand?.issue?.code}
        bidding={price.data?.expand?.project?.bidding}
        requester={price.data?.expand?.issue?.expand?.createdBy?.name}
        department={
          price.data?.expand?.issue?.expand?.createdBy?.expand?.department?.name
        }
        content={price.data?.expand?.issue?.title}
        data={priceDetails}
        suppliers={suppliers?.map(s => ({
          id: s.id,
          name: s.name
        }))}
        approvers={issue.data?.approver?.map(it => ({
          userId: it.userId,
          userName: it.userName,
          nodeId: it.nodeId,
          nodeName: it.nodeName
        }))}
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
        content: html,
        pageFormat: 'A4',
        pageOrientation: 'landscape'
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
  }, [
    price.data,
    priceDetails,
    suppliers,
    showLoading,
    hideLoading,
    issue.data
  ]);

  const handleDownload = useCallback(
    async (fileId: string, fileName: string) => {
      const response = await fetch(`${BASE_URL}/api/files/${fileId}`, {
        headers: {
          Authorization: 'Bearer ' + client.authStore.token
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    []
  );

  return (
    <div className={'bg-appWhite flex flex-col'}>
      <div className={'flex items-center justify-between p-2'}>
        <div className={'flex gap-2'}>
          <Button className={'text-appWhite'} size="icon" onClick={handlePrint}>
            <PrinterIcon className={'h-4 w-4'} />
          </Button>
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
              <Table className="border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead
                      rowSpan={2}
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                      style={{ width: 30 }}
                    >
                      STT
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                      style={{ width: 40 }}
                    >
                      ID
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                      style={{ width: 300 }}
                    >
                      Mô tả công việc mời thầu
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                      style={{ width: 100 }}
                    >
                      Khối lượng
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                      style={{ width: 50 }}
                    >
                      Đơn vị tính
                    </TableHead>
                    <TableHead
                      colSpan={1 + suppliers!.length}
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                    >
                      Đơn giá
                    </TableHead>
                    <TableHead
                      colSpan={1 + suppliers!.length}
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                    >
                      Thành tiền
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                      style={{ width: 100 }}
                    >
                      Dự toán
                    </TableHead>
                    {suppliers!.map(supplier => (
                      <TableHead
                        key={`price-${supplier.id}`}
                        className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                        style={{ width: 120 }}
                      >
                        {supplier.name}
                      </TableHead>
                    ))}
                    <TableHead
                      className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                      style={{ width: 100 }}
                    >
                      Dự toán
                    </TableHead>
                    {suppliers!.map(supplier => (
                      <TableHead
                        key={`total-${supplier.id}`}
                        className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                        style={{ width: 120 }}
                      >
                        {supplier.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map(row => {
                      return (
                        <TableRow
                          key={row.id}
                          className={cn('group w-full cursor-pointer', {
                            'bg-gray-50':
                              row.original.isSubTotal ||
                              row.original.isVAT ||
                              row.original.isFinalTotal
                          })}
                        >
                          {row.getVisibleCells().map(cell => (
                            <TableCell
                              key={cell.id}
                              style={{
                                width: cell.column.getSize()
                              }}
                              className={cn(
                                'bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight relative p-1 text-xs after:absolute after:right-0 after:top-0 after:h-full after:border-r after:content-[""]',
                                {
                                  'text-right':
                                    typeof cell.getValue() === 'number',
                                  'font-semibold':
                                    row.original.isSubTotal ||
                                    row.original.isVAT ||
                                    row.original.isFinalTotal
                                }
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center after:absolute after:right-0 after:top-0 after:h-full after:border-r after:content-['']"
                      >
                        Không có dữ liệu.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="attachment">
          <div className={'flex w-full flex-col gap-4 p-4'}>
            {issue.data?.expand?.issueFile_via_issue?.length ? (
              <div
                className={
                  'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                }
              >
                {issue.data.expand.issueFile_via_issue.map(file => (
                  <div
                    key={file.id}
                    className={
                      'flex items-center justify-between rounded-lg border p-3'
                    }
                  >
                    <div className={'flex min-w-0 flex-1 items-center gap-2'}>
                      {getFileIcon(file.type)}
                      <div className={'flex min-w-0 flex-1 flex-col'}>
                        <span className={'truncate text-sm font-medium'}>
                          {file.name}
                        </span>
                        <span className={'text-xs text-gray-500'}>
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 flex-shrink-0"
                      onClick={() => handleDownload(file.id, file.name)}
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={'flex h-40 items-center justify-center'}>
                <span className={'text-gray-500'}>Không có file đính kèm</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
