/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ExpandedState, Row, RowSelectionState, createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import _ from 'lodash';
import { Columns3Icon, Columns4Icon, ColumnsIcon, DownloadIcon, EditIcon, SheetIcon, SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import { detailApi, detailImportApi, detailInfoApi, projectApi } from 'portal-api';
import { DetailInfoResponse, client, downloadTemplate, maskVolumeString } from 'portal-core';



import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';



import { Show, cn, formatCurrency, formatNumber } from '@minhdtb/storeo-core';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, ThemeButton, closeModal, showModal, success, useConfirm, useLoading } from '@minhdtb/storeo-theme';



import { TreeData, arrayToTree, getCommonPinningStyles } from '../../../../../commons/utils';
import { ADMIN_ID, IndeterminateCheckbox } from '../../../../../components';
import { EditDetailForm } from '../../../../../components/models/detail/edit-detail-form';
import { NewDetailForm } from '../../../../../components/models/detail/new-detail-form';
import { ColumnManager } from '../../../../../components/models/project/column-manager';
import { NewColumnForm } from '../../../../../components/models/project/new-column-form';
import { useDetailImportStatus } from '../../../../../hooks';


const Component = () => {
  const { projectId } = Route.useParams();

  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<DetailInfoResponse>>>();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const modalId = useRef<string | undefined>();

  const { confirm } = useConfirm();
  const { showLoading, hideLoading } = useLoading();

  const queryClient = useQueryClient();

  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const deleteDetails = detailApi.delete.useMutation({
    onSuccess: async () => {
      success('Xóa hạng mục công việc thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailApi.listFull.getKey(projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: detailInfoApi.listFull.getKey(projectId)
        })
      ]);
    }
  });

  useDetailImportStatus(async (_, status) => {
    if (status === 'Done') {
      hideLoading();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailInfoApi.listFull.getKey(projectId)
        })
      ]);
    } else if (status === 'Error') {
      hideLoading();
    }
  });

  const uploadFile = detailImportApi.upload.useMutation({
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

  const onDetailSuccessHandler = useCallback(async () => {
    if (selectedRow) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailApi.listFull.getKey(projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: detailInfoApi.listFull.getKey(projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: detailApi.byId.getKey(selectedRow.original.group)
        })
      ]);
    }
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, [projectId, queryClient, selectedRow]);

  const onProjectSuccessHandler = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: projectApi.byId.getKey(projectId)
      })
    ]);
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, [projectId, queryClient]);

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

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleNewDetailParent = useCallback(() => {
    modalId.current = showModal({
      title: 'Thêm mục cha',
      children: (
        <NewDetailForm
          projectId={projectId}
          onSuccess={onDetailSuccessHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, [onCancelHandler, onDetailSuccessHandler, projectId]);

  const handleNewDetailChild = useCallback(() => {
    if (selectedRow) {
      modalId.current = showModal({
        title: 'Thêm mục con',
        children: (
          <NewDetailForm
            projectId={projectId}
            parent={selectedRow.original}
            onSuccess={onDetailSuccessHandler}
            onCancel={onCancelHandler}
          />
        )
      });
    }
  }, [onCancelHandler, onDetailSuccessHandler, projectId, selectedRow]);

  const handleEditDetail = useCallback(() => {
    if (selectedRow) {
      modalId.current = showModal({
        title: 'Sửa công việc',
        children: (
          <EditDetailForm
            detailId={selectedRow.original.group}
            onSuccess={onDetailSuccessHandler}
            onCancel={onCancelHandler}
          />
        )
      });
    }
  }, [onCancelHandler, onDetailSuccessHandler, selectedRow]);

  const handleNewColumn = useCallback(() => {
    modalId.current = showModal({
      title: 'Thêm cột',
      className: 'w-[25rem]',
      children: (
        <NewColumnForm
          projectId={projectId}
          onSuccess={onProjectSuccessHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, [onCancelHandler, onProjectSuccessHandler, projectId]);

  const handleManageColumn = useCallback(() => {
    modalId.current = showModal({
      title: 'Quản lý cột',
      children: (
        <ColumnManager projectId={projectId} onClose={onCancelHandler} />
      )
    });
  }, [onCancelHandler, projectId]);

  const project = projectApi.byId.useSuspenseQuery({
    variables: projectId
  });

  const columnHelper = createColumnHelper<TreeData<DetailInfoResponse>>();

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
        size: 30,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('level', {
        cell: info => info.getValue(),
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
        size: 30,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc mời thầu',
        footer: info => info.column.id,
        size: 300,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('volume', {
        cell: ({ row }) => (
          <div className={'flex justify-end gap-1'}>
            {maskVolumeString(formatNumber(row.original.volume))}
          </div>
        ),
        header: () => 'Khối lượng mời thầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('unit', {
        cell: ({ row }) => (
          <div className={'flex justify-center gap-1'}>{row.original.unit}</div>
        ),
        header: () => 'Đơn vị tính',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
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

    if (project.data.expand.column_via_project) {
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
  }, [columnHelper, project.data.expand.column_via_project]);

  const listDetailInfos = detailInfoApi.listFull.useSuspenseQuery({
    variables: projectId
  });

  const data = useMemo(
    () =>
      arrayToTree(listDetailInfos.data, `${projectId}-root`, (value, item) => {
        return _.chain(value)
          .filter(it => it.group === item.group)
          .uniqBy('request')
          .sumBy('requestVolume')
          .value();
      }).sort((v1, v2) => {
        return parseInt(v1.level) - parseInt(v2.level);
      }),
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
    getSubRows: row => row.children,
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
          <Cross2Icon className={'h-5 w-5'} />
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
                            ` bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight relative p-1 text-xs
                              after:absolute after:right-0 after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`,
                            selectedRow?.id === row.id
                              ? 'bg-appBlueLight text-appWhite hover:bg-appBlueLight group-hover:bg-appBlue'
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
  '/_authenticated/project/$projectId/contract/input'
)({
  component: Component,
  beforeLoad: () => ({ title: 'Hợp đồng đầu vào' })
});
