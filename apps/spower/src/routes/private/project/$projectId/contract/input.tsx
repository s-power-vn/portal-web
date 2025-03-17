/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from '@tanstack/react-router';
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
import { useVirtualizer } from '@tanstack/react-virtual';
import console from 'console';
import _ from 'lodash';
import {
  Columns3Icon,
  Columns4Icon,
  ColumnsIcon,
  DownloadIcon,
  EditIcon,
  PlusIcon,
  SheetIcon,
  SquareMinusIcon,
  SquarePlusIcon,
  XIcon
} from 'lucide-react';
import { api } from 'portal-api';
import type { DetailInfoResponse } from 'portal-core';
import { client, downloadTemplate, maskVolumeString } from 'portal-core';

import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Show, cn, formatCurrency, formatNumber } from '@minhdtb/storeo-core';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ThemeButton,
  showModal,
  success,
  useConfirm,
  useLoading
} from '@minhdtb/storeo-theme';

import type { TreeData } from '../../../../../../../../libs/core/src/commons/utils';
import {
  arrayToTree,
  compareVersion,
  getCommonPinningStyles
} from '../../../../../../../../libs/core/src/commons/utils';
import {
  ADMIN_ID,
  ColumnManager,
  EditDetailForm,
  IndeterminateCheckbox,
  NewColumnForm,
  NewDetailForm
} from '../../../../../components';
import {
  useDetailImportStatus,
  useInvalidateQueries
} from '../../../../../hooks';

const Component = () => {
  const { projectId } = Route.useParams();

  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<DetailInfoResponse>>>();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const { confirm } = useConfirm();
  const { showLoading, hideLoading } = useLoading();

  const invalidates = useInvalidateQueries();

  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const deleteDetails = api.detail.delete.useMutation({
    onSuccess: async () => {
      success('Xóa hạng mục công việc thành công');
      await invalidates([
        api.detail.listFull.getKey(projectId),
        api.detailInfo.listFull.getKey(projectId)
      ]);
    }
  });

  useDetailImportStatus(async (_, status) => {
    if (status === 'Done') {
      hideLoading();
      await invalidates([api.detailInfo.listFull.getKey(projectId)]);
    } else if (status === 'Error') {
      hideLoading();
    }
  });

  const uploadFile = api.detailImport.upload.useMutation({
    onError: () => {
      hideLoading();
    },
    onSettled: () => {
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  });

  const handleDownloadTemplate = useCallback(() => {
    return downloadTemplate('detail', 'application/vnd.ms-excel');
  }, []);

  const onFileChangeCapture = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        showLoading();
        uploadFile.mutate({
          files: e.target.files,
          projectId
        });
      }
    },
    [projectId, showLoading, uploadFile]
  );

  const handleNewDetailParent = useCallback(() => {
    showModal({
      title: 'Thêm mục cha',
      children: ({ close }) => (
        <NewDetailForm
          projectId={projectId}
          onSuccess={() => {
            invalidates([
              api.detail.listFull.getKey(projectId),
              api.detailInfo.listFull.getKey(projectId)
            ]);

            if (selectedRow) {
              invalidates([api.detail.byId.getKey(selectedRow.original.group)]);
            }

            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [invalidates, projectId, selectedRow]);

  const handleNewDetailChild = useCallback(() => {
    if (selectedRow) {
      showModal({
        title: 'Thêm mục con',
        children: ({ close }) => (
          <NewDetailForm
            projectId={projectId}
            parent={selectedRow.original}
            onSuccess={() => {
              invalidates([
                api.detail.listFull.getKey(projectId),
                api.detailInfo.listFull.getKey(projectId)
              ]);

              if (selectedRow) {
                invalidates([
                  api.detail.byId.getKey(selectedRow.original.group)
                ]);
              }

              close();
            }}
            onCancel={close}
          />
        )
      });
    }
  }, [invalidates, projectId, selectedRow]);

  const handleEditDetail = useCallback(() => {
    if (selectedRow) {
      showModal({
        title: 'Sửa công việc',
        children: ({ close }) => (
          <EditDetailForm
            detailId={selectedRow.original.group}
            onSuccess={() => {
              if (selectedRow) {
                invalidates([
                  api.detail.listFull.getKey(projectId),
                  api.detailInfo.listFull.getKey(projectId),
                  api.detail.byId.getKey(selectedRow.original.group)
                ]);
              }
              close();
            }}
            onCancel={close}
          />
        )
      });
    }
  }, [invalidates, projectId, selectedRow]);

  const handleNewColumn = useCallback(() => {
    showModal({
      title: 'Thêm cột',
      className: 'w-[25rem]',
      children: ({ close }) => (
        <NewColumnForm
          projectId={projectId}
          onSuccess={() => {
            invalidates([api.project.byId.getKey(projectId)]);
          }}
          onCancel={close}
        />
      )
    });
  }, [invalidates, projectId]);

  const handleManageColumn = useCallback(() => {
    showModal({
      title: 'Quản lý cột',
      children: ({ close }) => (
        <ColumnManager projectId={projectId} onClose={close} />
      )
    });
  }, [projectId]);

  const project = api.project.byId.useSuspenseQuery({
    variables: projectId
  });

  const columnHelper = createColumnHelper<TreeData<DetailInfoResponse>>();

  const resetDetails = useCallback(async () => {
    const details = await api.detail.listFull.fetcher(projectId);
    for (const detail of details) {
      console.log(detail);
      // await api.detail.delete.mutationFn([detail.id]);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // resetDetails();
    }, 5000);
  }, [invalidates, projectId]);

  const columns = useMemo(() => {
    const value = [
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div className={'flex w-full items-center'}>
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
        size: 30
      }),
      columnHelper.accessor('level', {
        cell: info => info.getValue(),
        header: () => (
          <div className={'flex w-full items-center justify-center'}>ID</div>
        ),
        footer: info => info.column.id,
        size: 50
      }),
      columnHelper.display({
        id: 'select',
        cell: ({ row }) => (
          <div className={'flex h-full w-full items-center justify-center'}>
            {row.subRows.length > 0 ? (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsAllSubRowsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />
            ) : (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />
            )}
          </div>
        ),
        header: () => (
          <div className={'text-center'}>
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          </div>
        ),
        footer: info => info.column.id,
        size: 30
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc mời thầu',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('volume', {
        cell: ({ row }) => (
          <div className={'flex justify-end gap-1'}>
            {maskVolumeString(formatNumber(row.original.volume))}
          </div>
        ),
        header: () => 'Khối lượng mời thầu',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('unit', {
        cell: ({ row }) => (
          <div className={'flex justify-center gap-1'}>{row.original.unit}</div>
        ),
        header: () => 'Đơn vị tính',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('unitPrice', {
        cell: ({ row }) => (
          <Show when={row.original.unitPrice}>
            <div className={'flex justify-end'}>
              {formatCurrency(row.original.unitPrice)}
              <span>₫</span>
            </div>
          </Show>
        ),
        header: () => 'Đơn giá dự thầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'biddingTotal',
        cell: ({ row }) => (
          <Show when={row.original.unitPrice}>
            <div className={'flex justify-end'}>
              {formatCurrency(row.original.unitPrice * row.original.volume)}
              <span>₫</span>
            </div>
          </Show>
        ),
        header: () => 'Thành tiền',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      })
    ];

    if (project.data.expand?.column_via_project) {
      for (const col of project.data.expand.column_via_project) {
        value.push(
          columnHelper.display({
            id: col.id,
            cell: ({ row }) => {
              const value = row.original.extend
                ? (row.original.extend as Record<string, any>)[col.id]
                : undefined;
              return (
                <Show when={value}>
                  <Show
                    when={col.type === 'Numeric'}
                    fallback={
                      <div className={'flex justify-center gap-1'}>{value}</div>
                    }
                  >
                    <div className={'flex justify-end gap-1'}>
                      {formatNumber(value)}
                    </div>
                  </Show>
                </Show>
              );
            },
            header: () => col.title,
            footer: info => info.column.id,
            size: 100,
            meta: {
              hasRowSpan: 'levelRowSpan'
            }
          })
        );
      }
    }

    return value;
  }, [columnHelper, project.data.expand?.column_via_project]);

  const listDetailInfos = api.detailInfo.listFull.useSuspenseQuery({
    variables: projectId
  });

  const data = useMemo(
    () =>
      arrayToTree(listDetailInfos.data, `${projectId}-root`, [
        'requestVolume',
        'issueCode',
        'issueTitle'
      ]).sort((v1, v2) => compareVersion(v1.level, v2.level)),
    [listDetailInfos.data, projectId]
  );

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnPinning: {
        left: ['id', 'level', 'select', 'title']
      }
    },
    state: {
      expanded,
      rowSelection,
      columnVisibility: {
        unitPrice: client.authStore.model?.id === ADMIN_ID,
        biddingTotal: client.authStore.model?.id === ADMIN_ID
      }
    },
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getSubRows: row =>
      row.children?.sort((v1, v2) => compareVersion(v1.level, v2.level)),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 20
  });

  return (
    <div className={'flex flex-col gap-2 p-2'}>
      <div className={'flex gap-2'}>
        <input
          type="file"
          ref={inputFileRef}
          multiple={false}
          className={'hidden'}
          accept=".xlsx"
          onChangeCapture={onFileChangeCapture}
        />
        <Button
          variant={'outline'}
          className={'flex gap-1'}
          onClick={() => inputFileRef.current?.click()}
        >
          <SheetIcon className={'h-5 w-5'} />
          Nhập từ Excel
        </Button>
        <Button
          variant={'outline'}
          className={'flex gap-1'}
          onClick={handleDownloadTemplate}
        >
          <DownloadIcon className={'h-5 w-5'} />
          Tải file mẫu
        </Button>
        <Button className={'flex gap-1'} onClick={handleNewDetailParent}>
          <PlusIcon />
          Thêm mục cha
        </Button>
        <Button
          disabled={!selectedRow}
          className={'flex gap-1'}
          onClick={handleNewDetailChild}
        >
          <PlusIcon />
          Thêm mục con
        </Button>
        <Button disabled={!selectedRow} size="icon" onClick={handleEditDetail}>
          <EditIcon className={'h-5 w-5'} />
        </Button>
        <Button
          disabled={_.keys(rowSelection).length === 0}
          variant="outline"
          className={'text-appWhite bg-red-500'}
          size="icon"
          onClick={() =>
            confirm('Bạn chắc chắn muốn xóa những mục đã chọn?', () => {
              const selected = table.getSelectedRowModel();
              showLoading();
              deleteDetails
                .mutateAsync(selected.flatRows.map(row => row.original.group))
                .then(() => {
                  setRowSelection({});
                })
                .finally(() => hideLoading());
            })
          }
        >
          <XIcon className={'h-5 w-5'} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ThemeButton size="icon" onClick={handleEditDetail}>
              <Columns4Icon className={'h-5 w-5'} />
            </ThemeButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-40"
            side="bottom"
            align="end"
            sideOffset={2}
          >
            <DropdownMenuItem onClick={handleNewColumn}>
              <Columns3Icon className="mr-2 h-4 w-4 text-red-500" />
              Thêm cột
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleManageColumn}>
              <ColumnsIcon className="mr-2 h-4 w-4 text-blue-500" />
              Quản lý cột
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className={
          'border-appBlue h-[calc(100vh-160px)] overflow-auto rounded-md border'
        }
        ref={parentRef}
      >
        <Table
          style={{
            width: table.getTotalSize()
          }}
        >
          <TableHeader className={'sticky top-0 z-10'}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className={'!border-b-0'}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles(header.column),
                        width: header.getSize()
                      }}
                      className={`bg-appBlueLight text-appWhite relative whitespace-nowrap p-1 text-center after:pointer-events-none
                          after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b
                          after:border-r after:content-[''] last:after:border-r-0`}
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
          <TableBody
            className={'relative'}
            style={{
              height: `${virtualizer.getTotalSize()}px`
            }}
          >
            {virtualizer.getVirtualItems().length ? (
              virtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    className={'group absolute w-full cursor-pointer'}
                    onClick={() => {
                      if (selectedRow?.id !== row.id) {
                        setSelectedRow(row);
                      } else {
                        setSelectedRow(undefined);
                      }
                    }}
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`
                    }}
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
                            ` bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight relative p-1 text-xs
                              after:absolute after:right-0 after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`,
                            selectedRow?.id === row.id
                              ? 'bg-appBlueLight text-appWhite hover:bg-appBlueLight group-hover:bg-appBlue'
                              : null
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
                <TableCell className={'text-center'} colSpan={columns.length}>
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

export const Route = createFileRoute(
  '/_private/project/$projectId/contract/input'
)({
  component: Component,
  beforeLoad: () => ({ title: 'Hợp đồng đầu vào' })
});
