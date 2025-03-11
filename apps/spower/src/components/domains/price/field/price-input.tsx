import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import clsx from 'clsx';
import _ from 'lodash';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { api } from 'portal-api';
import { cn, compareVersion } from 'portal-core';
import { AnyObject, ObjectSchema } from 'yup';

import { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  showModal,
  useStoreoForm
} from '@minhdtb/storeo-theme';

import { PickFinishedRequestDetailForm } from '../../request';
import { PickSuppliersForm } from '../../supplier';

// Convert interfaces to types
type PriceInputData = {
  id?: string;
  isNew?: boolean;
  title: string;
  volume: number;
  unit: string;
  estimatePrice: number | '';
  estimateAmount: number | '';
  level?: string;
  index?: string;
  prices: {
    [key: string]: number | '';
  };
};

type PriceData = PriceInputData & {
  stt: number;
  totals: {
    [key: string]: number | '';
  };
  isSubTotal?: boolean;
  isGrandTotal?: boolean;
  isVAT?: boolean;
  isFinalTotal?: boolean;
};

const columnHelper = createColumnHelper<PriceData>();

export type PriceInputProps = {
  value?: PriceInputData[];
  onChange?: (data: PriceInputData[]) => void;
  projectId?: string;
  schema?: ObjectSchema<AnyObject>;
};

const calculateTotals = (data: PriceData[], suppliers?: string[]) => {
  const regularRows = data.filter(
    row =>
      !row.isSubTotal && !row.isGrandTotal && !row.isVAT && !row.isFinalTotal
  );

  const calculateSum = (values: (number | '')[]) => {
    const sum = values.reduce(
      (acc: number, val) => acc + (typeof val === 'number' ? val : 0),
      0
    );
    return isNaN(sum) ? '' : sum;
  };

  const subTotal: PriceData = {
    stt: 0,
    title: 'Tổng cộng trước thuế',
    volume: 0,
    unit: '',
    estimatePrice: '',
    estimateAmount: calculateSum(regularRows.map(row => row.estimateAmount)),
    prices: {},
    totals: suppliers
      ? suppliers?.reduce(
          (acc, supplier) => ({
            ...acc,
            [supplier]: calculateSum(
              regularRows.map(row => row.totals[supplier])
            )
          }),
          {}
        )
      : {},
    isSubTotal: true
  };

  const vat: PriceData = {
    stt: 0,
    title: 'Thuế VAT 10%',
    volume: 0,
    unit: '',
    estimatePrice: '',
    estimateAmount:
      typeof subTotal.estimateAmount === 'number'
        ? subTotal.estimateAmount * 0.1
        : '',
    prices: {},
    totals:
      suppliers?.reduce(
        (acc, supplier) => ({
          ...acc,
          [supplier]:
            typeof subTotal.totals[supplier] === 'number'
              ? subTotal.totals[supplier] * 0.1
              : ''
        }),
        {}
      ) ?? {},
    isVAT: true
  };

  const finalTotal: PriceData = {
    stt: 0,
    title: 'Giá trị sau thuế',
    volume: 0,
    unit: '',
    estimatePrice: '',
    estimateAmount:
      typeof subTotal.estimateAmount === 'number' &&
      typeof vat.estimateAmount === 'number'
        ? subTotal.estimateAmount + vat.estimateAmount
        : '',
    prices: {},
    totals:
      suppliers?.reduce(
        (acc, supplier) => ({
          ...acc,
          [supplier]:
            typeof subTotal.totals[supplier] === 'number' &&
            typeof vat.totals[supplier] === 'number'
              ? subTotal.totals[supplier] + vat.totals[supplier]
              : ''
        }),
        {}
      ) ?? {},
    isFinalTotal: true
  };

  return [...regularRows, subTotal, vat, finalTotal];
};

const toInternalData = (data: PriceInputData[]): PriceData[] =>
  data.map((row, index) => ({
    ...row,
    stt: index + 1,
    totals: Object.entries(row.prices).reduce(
      (acc, [supplier, price]) => ({
        ...acc,
        [supplier]: typeof price === 'number' ? row.volume * price : ''
      }),
      {}
    )
  }));

export const PriceInput: FC<PriceInputProps> = ({
  value,
  onChange,
  projectId
}) => {
  const [data, setData] = useState<PriceInputData[]>(value ?? []);
  const [supplierIds, setSupplierIds] = useState<string[]>(() => {
    if (!value?.length) return [];
    return _.uniq(value.flatMap(item => Object.keys(item.prices)));
  });
  const [internalData, setInternalData] = useState(() =>
    calculateTotals(toInternalData(data), supplierIds)
  );

  const { getValues, setValue } = useStoreoForm();

  useEffect(() => {
    setData(value ?? []);
    if (value?.length) {
      const newSupplierIds = _.uniq(
        value.flatMap(item => Object.keys(item.prices))
      );
      setSupplierIds(newSupplierIds);
    }
  }, [value]);

  useEffect(() => {
    setInternalData(calculateTotals(toInternalData(data), supplierIds));
  }, [data, supplierIds]);

  const { data: suppliers = [] } = api.supplier.listByIds.useSuspenseQuery({
    variables: supplierIds
  });

  console.log(supplierIds, suppliers);

  const handleDataChange = (newData: PriceData[]) => {
    const regularData = newData
      .filter(row => !row.isSubTotal && !row.isVAT && !row.isFinalTotal)
      .map(({ totals, isSubTotal, isVAT, isFinalTotal, ...rest }) => rest);

    setData(regularData);
    const calculatedData = calculateTotals(newData, supplierIds);
    setInternalData(calculatedData);
    onChange?.(regularData);
  };

  const handlePickRequest = useCallback(() => {
    if (projectId) {
      showModal({
        title: 'Chọn từ yêu cầu mua hàng',
        className: 'min-w-[800px]',
        children: ({ close }) => (
          <PickFinishedRequestDetailForm
            projectId={projectId}
            onSuccess={value => {
              const newItems = _.chain(value.requestDetails)
                .filter(detail => {
                  if (!detail.unit) {
                    return false;
                  }

                  return !data.some(
                    existingItem => existingItem.title === detail.title
                  );
                })
                .sort((a, b) => compareVersion(a.level, b.level))
                .map(detail => ({
                  title: detail.title,
                  volume: 0,
                  unit: detail.unit || '',
                  estimatePrice: 0,
                  estimateAmount: 0,
                  level: detail.level,
                  index: detail.index,
                  isNew: true,
                  prices: supplierIds.reduce(
                    (acc, supplier) => ({
                      ...acc,
                      [supplier]: 0
                    }),
                    {}
                  )
                }))
                .value();

              if (newItems.length > 0) {
                const newData = [...data, ...newItems];
                setData(newData);
                onChange?.(newData);
              }
              close();
            }}
            onCancel={close}
          />
        )
      });
    }
  }, [projectId, data, supplierIds, onChange]);

  const handlePickSupplier = useCallback(() => {
    showModal({
      title: 'Chọn nhà cung cấp',
      children: ({ close }) => (
        <PickSuppliersForm
          initialSuppliers={supplierIds}
          onSuccess={value => {
            setSupplierIds(value.suppliers);
            const newData = data.map(item => ({
              ...item,
              prices: {
                ...value.suppliers.reduce(
                  (acc: Record<string, number>, supplier: string) => ({
                    ...acc,
                    [supplier]: 0
                  }),
                  {}
                )
              }
            }));
            setData(newData);
            onChange?.(newData);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [supplierIds, data, onChange]);

  const columns = [
    columnHelper.display({
      id: 'actions',
      header: () => <div className="p-1"></div>,
      cell: info => {
        if (
          info.row.original.isSubTotal ||
          info.row.original.isVAT ||
          info.row.original.isFinalTotal
        ) {
          return null;
        }
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={e => {
              e.stopPropagation();
              const itemToRemove = data[info.row.index];
              if (!itemToRemove.isNew && itemToRemove.id) {
                const currentDeletedIds = getValues('deletedIds') || [];
                setValue('deletedIds', [...currentDeletedIds, itemToRemove.id]);
              }
              const newData = data.filter(
                (_, index) => index !== info.row.index
              );
              setData(newData);
              onChange?.(newData);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        );
      },
      size: 50
    }),
    columnHelper.accessor('level', {
      header: () => <div className="p-1 text-center">ID</div>,
      cell: info => {
        if (
          info.row.original.isSubTotal ||
          info.row.original.isVAT ||
          info.row.original.isFinalTotal
        ) {
          return '';
        }
        return <span className="text-center">{info.getValue()}</span>;
      },
      size: 50
    }),
    columnHelper.accessor('index', {
      header: () => (
        <div className="flex h-full items-center justify-center p-1">STT</div>
      ),
      cell: info => {
        if (
          info.row.original.isSubTotal ||
          info.row.original.isVAT ||
          info.row.original.isFinalTotal
        ) {
          return '';
        }
        const value = info.getValue();
        return <span className="block text-center">{value || ''}</span>;
      },
      size: 80
    }),
    columnHelper.accessor('title', {
      header: () => <div className="p-1">Mô tả công việc mới thầu</div>,
      cell: info => info.getValue(),
      size: 300
    }),
    columnHelper.accessor('volume', {
      header: () => <div className="p-1">Khối lượng</div>,
      cell: info => {
        if (
          info.row.original.isSubTotal ||
          info.row.original.isVAT ||
          info.row.original.isFinalTotal
        ) {
          return '';
        }

        return (
          <EditableCell
            value={info.getValue()}
            onChange={value => {
              const newData = internalData.map((row, index) => {
                if (index === info.row.index) {
                  const newVolume = Number(value);
                  const newTotals = {} as Record<string, number | ''>;

                  Object.entries(row.prices).forEach(([supplier, price]) => {
                    newTotals[supplier] =
                      typeof price === 'number' ? newVolume * price : '';
                  });

                  return {
                    ...row,
                    volume: newVolume,
                    totals: newTotals
                  };
                }
                return row;
              });

              handleDataChange(newData);
            }}
          />
        );
      },
      size: 120
    }),
    columnHelper.accessor('unit', {
      header: () => <div className="p-1">Đơn vị</div>,
      cell: info => info.getValue(),
      size: 100
    }),
    columnHelper.group({
      id: 'prices',
      header: () => <div className="p-1 text-center">Đơn giá</div>,
      columns: [
        columnHelper.accessor('estimatePrice', {
          header: () => <div className="p-1 text-center">Dự toán</div>,
          cell: info => {
            if (
              info.row.original.isSubTotal ||
              info.row.original.isVAT ||
              info.row.original.isFinalTotal
            ) {
              return info.getValue()?.toLocaleString('vi-VN');
            }
            return (
              <EditableCell
                value={info.getValue()}
                onChange={value => {
                  const newData = internalData.map((row, index) => {
                    if (index === info.row.index) {
                      const newPrice = Number(value);
                      return {
                        ...row,
                        estimatePrice: newPrice,
                        estimateAmount: row.volume * newPrice
                      };
                    }
                    return row;
                  });

                  handleDataChange(newData);
                }}
              />
            );
          }
        }),
        ...(suppliers ?? []).map(supplier =>
          columnHelper.accessor(row => row.prices[supplier.id], {
            id: `price-${supplier.id}`,
            header: () => (
              <div className="p-1 text-center">{supplier.name}</div>
            ),
            cell: info => {
              if (
                info.row.original.isSubTotal ||
                info.row.original.isVAT ||
                info.row.original.isFinalTotal
              ) {
                return info.getValue()?.toLocaleString('vi-VN') ?? '';
              }
              return (
                <EditableCell
                  value={info.getValue() ?? 0}
                  onChange={value => {
                    const newData = internalData.map((row, index) => {
                      if (index === info.row.index) {
                        const newPrice = Number(value);
                        return {
                          ...row,
                          prices: {
                            ...row.prices,
                            [supplier.id]: newPrice
                          },
                          totals: {
                            ...row.totals,
                            [supplier.id]: row.volume * newPrice
                          }
                        };
                      }
                      return row;
                    });

                    handleDataChange(newData);
                  }}
                />
              );
            }
          })
        )
      ]
    }),
    columnHelper.group({
      id: 'totals',
      header: () => <div className="p-1 text-center">Thành tiền</div>,
      columns: [
        columnHelper.accessor('estimateAmount', {
          header: () => <div className="p-1 text-center">Dự toán</div>,
          cell: info => info.getValue()?.toLocaleString('vi-VN')
        }),
        ...(suppliers ?? []).map(supplier =>
          columnHelper.accessor(row => row.totals[supplier.id], {
            id: `total-${supplier.id}`,
            header: () => (
              <div className="p-1 text-center">{supplier.name}</div>
            ),
            cell: info => info.getValue()?.toLocaleString('vi-VN')
          })
        )
      ]
    })
  ];

  const table = useReactTable({
    data: internalData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange'
  });

  const tableRef = useRef<HTMLDivElement>(null);

  const removeSupplier = (supplierToRemove: string) => {
    setSupplierIds(supplierIds.filter(s => s !== supplierToRemove));

    const newData = internalData.map(row => {
      const {
        prices: { [supplierToRemove]: _, ...remainingPrices },
        totals: { [supplierToRemove]: __, ...remainingTotals },
        ...rest
      } = row;
      return {
        ...rest,
        prices: remainingPrices,
        totals: remainingTotals
      };
    });

    handleDataChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className={'flex items-end justify-between'}>
        <span className={'text-sm font-medium'}>Hạng mục công việc</span>
        <div className={'flex gap-2'}>
          <Button
            className={'bg-green-500 text-sm hover:bg-orange-400'}
            type={'button'}
            onClick={handlePickSupplier}
          >
            <PlusIcon className={'mr-2 h-4 w-4'} />
            Thêm nhà cung cấp
          </Button>
          <Button
            type={'button'}
            className={cn('text-sm')}
            onClick={handlePickRequest}
          >
            <PlusIcon className={'mr-2 h-4 w-4'} />
            Chọn hạng mục từ yêu cầu mua hàng
          </Button>
        </div>
      </div>

      <div
        ref={tableRef}
        className="border-appBlue h-[20rem] overflow-auto rounded-md border"
      >
        <Table>
          <TableHeader className="bg-appBlueLight sticky top-0">
            <TableRow
              className="!border-b-0"
              style={{ width: table.getTotalSize() }}
            >
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                style={{ width: table.getColumn('actions')?.getSize() }}
              >
                {/* Empty header for delete column */}
              </TableHead>
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                style={{ width: table.getColumn('level')?.getSize() }}
              >
                ID
              </TableHead>
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                style={{ width: table.getColumn('index')?.getSize() }}
              >
                STT
              </TableHead>
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                style={{ width: table.getColumn('title')?.getSize() }}
              >
                Mô tả công việc mời thầu
              </TableHead>
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Khối lượng
              </TableHead>
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Đơn vị
              </TableHead>
              <TableHead
                colSpan={1 + (suppliers ?? []).length}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Đơn giá
              </TableHead>
              <TableHead
                colSpan={1 + (suppliers ?? []).length}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Thành tiền
              </TableHead>
            </TableRow>
            <TableRow className="!border-b-0">
              <TableHead className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']">
                Dự toán
              </TableHead>
              {suppliers?.map(supplier => (
                <TableHead
                  key={`price-${supplier.id}`}
                  data-supplier={supplier.id}
                  className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{supplier.name}</span>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeSupplier(supplier.id);
                      }}
                      className="text-red-300 hover:text-red-100"
                    >
                      ×
                    </button>
                  </div>
                </TableHead>
              ))}
              <TableHead className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']">
                Dự toán
              </TableHead>
              {suppliers?.map(supplier => (
                <TableHead
                  key={`total-${supplier.id}`}
                  className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                >
                  {supplier.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                className={clsx('hover:bg-appGrayLight', {
                  'font-semibold':
                    row.original.isSubTotal ||
                    row.original.isVAT ||
                    row.original.isFinalTotal,
                  'bg-gray-50':
                    row.original.isSubTotal || row.original.isFinalTotal
                })}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className={clsx(
                      'bg-appWhite relative p-1 text-xs after:absolute after:right-0 after:top-0 after:h-full after:border-r after:content-[""]',
                      {
                        'text-right': typeof cell.getValue() === 'number'
                      }
                    )}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

type EditableCellProps = {
  value: number | string | '';
  onChange: (value: string) => void;
};

const EditableCell: FC<EditableCellProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  const handleFinishEdit = () => {
    setIsEditing(false);
    onChange(localValue.toString());
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={localValue}
        onChange={handleChange}
        onBlur={handleFinishEdit}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleFinishEdit();
          }
        }}
        className="w-full p-1 text-right"
      />
    );
  }

  return (
    <div
      className="cursor-pointer rounded px-2 py-1 text-right hover:bg-gray-100"
      onClick={() => setIsEditing(true)}
    >
      {typeof localValue === 'number'
        ? localValue.toLocaleString('vi-VN')
        : localValue}
    </div>
  );
};
