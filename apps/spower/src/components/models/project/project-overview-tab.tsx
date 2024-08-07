import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
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
  DownloadIcon,
  EditIcon,
  SheetIcon,
  SquareMinusIcon,
  SquarePlusIcon
} from 'lucide-react';

import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  DetailInfoResponse,
  Show,
  client,
  cn,
  downloadTemplate,
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
  useConfirm,
  useLoading
} from '@storeo/theme';

import { detailApi, detailImportApi, detailInfoApi } from '../../../api';
import {
  TreeData,
  arrayToTree,
  getCommonPinningStyles
} from '../../../commons/utils';
import { useDetailImportStatus } from '../../../hooks';
import { Route } from '../../../routes/_authenticated/project/$projectId';
import { IndeterminateCheckbox } from '../../checkbox/indeterminate-checkbox';
import { EditDetailForm } from '../detail/edit-detail-form';
import { NewDetailForm } from '../detail/new-detail-form';

export const ADMIN_ID = '4jepkf28idxcfij'; /* TODO */

export type ProjectOverviewTabProps = {
  projectId: string;
};

export const ProjectOverviewTab: FC<ProjectOverviewTabProps> = ({
  projectId
}) => {
  const navigate = useNavigate({ from: Route.fullPath });

  const queryClient = useQueryClient();

  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<DetailInfoResponse>>>();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const listDetailInfos = detailInfoApi.listFull.useSuspenseQuery({
    variables: projectId
  });

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

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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

  const columnHelper = createColumnHelper<TreeData<DetailInfoResponse>>();

  const { confirm } = useConfirm();

  const handleGotoIssue = useCallback(
    (issueId: string) => {
      return navigate({
        to: '/project/$projectId/issues/all/$issueId',
        params: {
          issueId
        }
      });
    },
    [navigate]
  );

  const columns = useMemo(
    () => [
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
        header: () => 'Mô tả công việc',
        footer: info => info.column.id,
        size: 300,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('volume', {
        cell: ({ row }) => (
          <div className={'flex justify-end gap-1'}>
            <span className={'font-semibold'}>
              {formatNumber(row.original.volume)}
            </span>
          </div>
        ),
        header: () => 'Khối lượng HĐ',
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
        header: () => 'Đơn vị',
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
              <span className={'font-semibold'}>
                {formatCurrency(row.original.unitPrice)}
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
        id: 'biddingTotal',
        cell: ({ row }) => (
          <Show when={row.original.unitPrice}>
            <div className={'flex justify-end'}>
              <span className={'font-semibold'}>
                {formatCurrency(row.original.unitPrice * row.original.volume)}
              </span>
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
      }),
      columnHelper.display({
        id: 'requestTitle',
        cell: ({ row }) => (
          <Show when={row.original.issue}>
            <button
              className={'max-w-60 cursor-pointer truncate text-left underline'}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                return handleGotoIssue(row.original.issue);
              }}
            >
              {row.original.issueTitle}
            </button>
          </Show>
        ),
        header: () => 'Yêu cầu mua hàng',
        footer: info => info.column.id,
        size: 250,
        meta: {
          hasRowSpan: 'requestRowSpan'
        }
      }),
      columnHelper.display({
        id: 'requestVolume',
        cell: ({ row }) => (
          <Show when={row.original.requestVolume}>
            <div className={'flex justify-end gap-1'}>
              <span className={'font-semibold'}>
                {formatNumber(row.original.requestVolume)}
              </span>
            </div>
          </Show>
        ),
        header: () => 'Khối lượng yêu cầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'requestRowSpan'
        }
      }),
      columnHelper.display({
        id: 'totalRequestVolume',
        cell: ({ row }) => (
          <Show when={row.original.extra}>
            <div className={'flex justify-end gap-1'}>
              <span className={'font-semibold'}>
                {formatNumber(row.original.extra as number)}
              </span>
            </div>
          </Show>
        ),
        header: () => 'Tổng KL yêu cầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'exceedVolume',
        cell: ({ row }) => {
          if (row.original.extra) {
            const exceed = (row.original.extra as number) - row.original.volume;

            return (
              <Show when={exceed}>
                <div
                  className={cn(
                    'flex w-full justify-end gap-1',
                    exceed < 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  <span className={'font-semibold'}>
                    {formatNumber(exceed < 0 ? -exceed : exceed)}
                  </span>
                </div>
              </Show>
            );
          }
          return null;
        },
        header: () => 'Khối lượng phát sinh',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('price', {
        cell: info => (
          <Show when={info.getValue()}>
            <div className={'flex justify-end gap-1'}>
              <span className={'font-semibold'}>
                {formatCurrency(info.getValue())}
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
            const exceed = row.original.price - row.original.unitPrice;
            if (exceed > 0) {
              return (
                <div className={'flex justify-end text-red-500'}>
                  <span className={'font-bold'}>{formatCurrency(exceed)}</span>
                  <span>₫</span>
                </div>
              );
            } else {
              return (
                <div className={'flex justify-end text-green-500'}>
                  <span className={'font-bold'}>{formatCurrency(-exceed)}</span>
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
      columnHelper.accessor('supplier', {
        cell: info => info.row.original.supplierName,
        header: () => 'Nhà cung cấp',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.display({
        id: 'supplierStatus',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Trạng thái NCC',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'contractStatus',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Trạng thái HĐ',
        footer: info => info.column.id,
        size: 150
      })
    ],
    [columnHelper]
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

  const { showLoading, hideLoading } = useLoading();

  const parentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

  useEffect(() => {
    const { rows } = table.getRowModel();

    rows.forEach(row => {
      if (row.subRows.length > 0) {
        if (row.getIsAllSubRowsSelected()) {
          row.toggleSelected(true);
        } else {
          row.toggleSelected(false, {
            selectChildren: false
          });
        }
      }
    });
  }, [rowSelection, table]);

  const handleDownloadTemplate = useCallback(() => {
    return downloadTemplate('detail', 'application/vnd.ms-excel');
  }, []);

  const modalId = useRef<string | undefined>();

  const onSuccessHandler = useCallback(async () => {
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
          onSuccess={onSuccessHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, [onCancelHandler, onSuccessHandler, projectId]);

  const handleNewDetailChild = useCallback(() => {
    if (selectedRow) {
      modalId.current = showModal({
        title: 'Thêm mục con',
        children: (
          <NewDetailForm
            projectId={projectId}
            parent={selectedRow.original}
            onSuccess={onSuccessHandler}
            onCancel={onCancelHandler}
          />
        )
      });
    }
  }, [onCancelHandler, onSuccessHandler, projectId, selectedRow]);

  const handleEditDetail = useCallback(() => {
    if (selectedRow) {
      modalId.current = showModal({
        title: 'Sửa công việc',
        children: (
          <EditDetailForm
            detailId={selectedRow.original.group}
            onSuccess={onSuccessHandler}
            onCancel={onCancelHandler}
          />
        )
      });
    }
  }, [onCancelHandler, onSuccessHandler, selectedRow]);

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
          Thêm mục
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
              deleteDetails
                .mutateAsync(selected.flatRows.map(row => row.original.group))
                .then(() => setRowSelection({}));
            })
          }
        >
          <Cross2Icon className={'h-5 w-5'} />
        </Button>
      </div>
      <div
        ref={parentRef}
        className={
          'border-appBlue h-[calc(100vh-214px)] overflow-auto rounded-md border'
        }
      >
        <Table
          style={{
            width: table.getTotalSize()
          }}
        >
          <TableHeader
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 2
            }}
          >
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
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => {
                return (
                  <TableRow
                    key={row.id}
                    className={'group w-full cursor-pointer'}
                    onClick={() => {
                      if (selectedRow?.id !== row.id) {
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
