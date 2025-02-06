import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import clsx from 'clsx';
import _ from 'lodash';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { cn } from 'portal-core';
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
  showModal
} from '@minhdtb/storeo-theme';

import { compareVersion } from '../../../commons/utils';
import { PickRequestInput, RequestDetailItem } from '../request';

// Convert interfaces to types
type PriceInputData = {
  code: string;
  volume: number;
  unit: string;
  estimate: number | '';
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

export type { PriceData, PriceInputData };

const columnHelper = createColumnHelper<PriceData>();

export type PriceInputProps = {
  initialData?: PriceInputData[];
  initialSuppliers?: string[];
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
    code: 'Tổng cộng trước thuế',
    volume: 0,
    unit: '',
    estimate: calculateSum(regularRows.map(row => row.estimate)),
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
    code: 'Thuế VAT 10%',
    volume: 0,
    unit: '',
    estimate:
      typeof subTotal.estimate === 'number' ? subTotal.estimate * 0.1 : '',
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
    code: 'Giá trị sau thuế',
    volume: 0,
    unit: '',
    estimate:
      typeof subTotal.estimate === 'number' && typeof vat.estimate === 'number'
        ? subTotal.estimate + vat.estimate
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
  initialData = [],
  initialSuppliers = [],
  onChange,
  projectId
}) => {
  const [data, setData] = useState<PriceInputData[]>(initialData);
  const [suppliers, setSuppliers] = useState<string[]>(initialSuppliers);
  const [internalData, setInternalData] = useState(() =>
    calculateTotals(toInternalData(data), suppliers)
  );
  const [selectedDetails, setSelectedDetails] = useState<RequestDetailItem[]>(
    []
  );

  useEffect(() => {
    setInternalData(calculateTotals(toInternalData(data), suppliers));
  }, [data, suppliers]);

  const handleDataChange = (newData: PriceData[]) => {
    const regularData = newData
      .filter(row => !row.isSubTotal && !row.isVAT && !row.isFinalTotal)
      .map(({ totals, isSubTotal, isVAT, isFinalTotal, ...rest }) => rest);

    setData(regularData);

    const calculatedData = calculateTotals(newData, suppliers);
    setInternalData(calculatedData);

    onChange?.(regularData);
  };

  const handlePickRequest = useCallback(() => {
    if (projectId) {
      showModal({
        title: 'Chọn từ yêu cầu mua hàng',
        className: 'min-w-[800px]',
        children: ({ close }) => (
          <PickRequestInput
            onChange={value => {
              setSelectedDetails(value);
              const newItems = _.chain(value)
                .filter(detail => {
                  if (!detail.unit) {
                    return false;
                  }

                  return !data.some(
                    existingItem => existingItem.code === detail.title
                  );
                })
                .sort((a, b) => compareVersion(a.level, b.level))
                .map(detail => ({
                  code: detail.title,
                  volume: 0,
                  unit: detail.unit || '',
                  estimate: 0,
                  prices: suppliers
                    ? suppliers.reduce(
                        (acc, supplier) => ({
                          ...acc,
                          [supplier]: 0
                        }),
                        {}
                      )
                    : {}
                }))
                .value();

              if (newItems.length > 0) {
                setData([...data, ...newItems]);
              }
              close();
            }}
          />
        )
      });
    }
  }, [projectId, data, suppliers]);

  const columns = [
    columnHelper.accessor('stt', {
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
        return <span>{info.getValue()}</span>;
      }
    }),
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
              const newData = data.filter(
                (_, index) => index !== info.row.index
              );
              setData(newData);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        );
      }
    }),
    columnHelper.accessor('code', {
      header: () => <div className="p-1">Mô tả công việc mới thầu</div>,
      cell: info => info.getValue()
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
      }
    }),
    columnHelper.accessor('unit', {
      header: () => <div className="p-1">Đơn vị</div>,
      cell: info => info.getValue()
    }),
    columnHelper.accessor('estimate', {
      header: () => <div className="p-1">Dự toán</div>,
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
                  return {
                    ...row,
                    estimate: Number(value)
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
    columnHelper.group({
      id: 'prices',
      header: () => <div className="p-1 text-center">Đơn giá</div>,
      columns: suppliers?.map(supplier =>
        columnHelper.accessor(row => row.prices[supplier], {
          id: `price-${supplier}`,
          header: () => <div className="p-1 text-center">{supplier}</div>,
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
                          [supplier]: newPrice
                        },
                        totals: {
                          ...row.totals,
                          [supplier]: row.volume * newPrice
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
    }),
    columnHelper.group({
      id: 'totals',
      header: () => <div className="p-1 text-center">Thành tiền</div>,
      columns: suppliers?.map(supplier =>
        columnHelper.accessor(row => row.totals[supplier], {
          id: `total-${supplier}`,
          header: () => <div className="p-1 text-center">{supplier}</div>,
          cell: info => info.getValue()?.toLocaleString('vi-VN')
        })
      )
    })
  ];

  const table = useReactTable({
    data: internalData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const tableRef = useRef<HTMLDivElement>(null);

  const addSupplier = () => {
    const newSupplier = `Nhà cung cấp ${suppliers.length + 1}`;
    setSuppliers([...suppliers, newSupplier]);

    const newData = internalData.map(row => {
      if (row.isSubTotal || row.isVAT || row.isFinalTotal) {
        return {
          ...row,
          prices: {
            ...row.prices,
            [newSupplier]: '' as const
          },
          totals: {
            ...row.totals,
            [newSupplier]: '' as const
          }
        };
      }

      return {
        ...row,
        prices: {
          ...row.prices,
          [newSupplier]: 0 as number
        },
        totals: {
          ...row.totals,
          [newSupplier]: 0 as number
        }
      };
    });

    handleDataChange(newData);

    setTimeout(() => {
      const newSupplierElement = tableRef.current?.querySelector(
        `[data-supplier="${newSupplier}"]`
      );
      newSupplierElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
  };

  const removeSupplier = (supplierToRemove: string) => {
    setSuppliers(suppliers.filter(s => s !== supplierToRemove));

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
            onClick={addSupplier}
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
        className="border-appBlue h-[25rem] overflow-auto rounded-md border"
      >
        <Table>
          <TableHeader className="bg-appBlueLight sticky top-0 z-10">
            <TableRow className="!border-b-0">
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                STT
              </TableHead>
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                {/* Empty header for delete column */}
              </TableHead>
              <TableHead
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
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
                rowSpan={2}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Dự toán
              </TableHead>
              <TableHead
                colSpan={(suppliers ?? []).length}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Đơn giá
              </TableHead>
              <TableHead
                colSpan={(suppliers ?? []).length}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Thành tiền
              </TableHead>
            </TableRow>
            <TableRow className="!border-b-0">
              {suppliers?.map(supplier => (
                <TableHead
                  key={`price-${supplier}`}
                  data-supplier={supplier}
                  className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{supplier}</span>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeSupplier(supplier);
                      }}
                      className="text-red-300 hover:text-red-100"
                    >
                      ×
                    </button>
                  </div>
                </TableHead>
              ))}
              {suppliers?.map(supplier => (
                <TableHead
                  key={`total-${supplier}`}
                  className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
                >
                  {supplier}
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

  const handleFinishEdit = () => {
    setIsEditing(false);
    onChange(localValue.toString());
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={localValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLocalValue(e.target.value)
        }
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
