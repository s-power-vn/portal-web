import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import clsx from 'clsx';

import { useEffect, useRef, useState } from 'react';

import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@minhdtb/storeo-theme';

// Data structure for input/output
interface PriceInputData {
  code: string;
  volume: number;
  unit: string;
  estimate: number | '';
  prices: {
    [key: string]: number | '';
  };
}

// Internal data structure for display
interface PriceData extends PriceInputData {
  stt: number;
  totals: {
    [key: string]: number | '';
  };
  isSubTotal?: boolean;
  isGrandTotal?: boolean;
  isVAT?: boolean;
  isFinalTotal?: boolean;
}

export type { PriceData, PriceInputData };

const columnHelper = createColumnHelper<PriceData>();

interface PriceTableProps {
  data: PriceInputData[];
  suppliers: string[];
  onChange?: (data: PriceInputData[]) => void;
  onAddSupplier?: (newSupplier: string) => void;
  onRemoveSupplier?: (supplier: string) => void;
}

const calculateTotals = (data: PriceData[], suppliers: string[]) => {
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
    totals: suppliers.reduce(
      (acc, supplier) => ({
        ...acc,
        [supplier]: calculateSum(regularRows.map(row => row.totals[supplier]))
      }),
      {}
    ),
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
    totals: suppliers.reduce(
      (acc, supplier) => ({
        ...acc,
        [supplier]:
          typeof subTotal.totals[supplier] === 'number'
            ? subTotal.totals[supplier] * 0.1
            : ''
      }),
      {}
    ),
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
    totals: suppliers.reduce(
      (acc, supplier) => ({
        ...acc,
        [supplier]:
          typeof subTotal.totals[supplier] === 'number' &&
          typeof vat.totals[supplier] === 'number'
            ? subTotal.totals[supplier] + vat.totals[supplier]
            : ''
      }),
      {}
    ),
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

export function PriceTable({
  data,
  suppliers,
  onChange,
  onAddSupplier,
  onRemoveSupplier
}: PriceTableProps) {
  const [internalData, setInternalData] = useState(() =>
    calculateTotals(toInternalData(data), suppliers)
  );

  // Sync internal data with external value
  useEffect(() => {
    setInternalData(calculateTotals(toInternalData(data), suppliers));
  }, [data, suppliers]);

  // Handler for internal data changes
  const handleDataChange = (newData: PriceData[]) => {
    // Filter out summary rows and remove totals before calling onChange
    const regularData = newData
      .filter(row => !row.isSubTotal && !row.isVAT && !row.isFinalTotal)
      .map(({ totals, isSubTotal, isVAT, isFinalTotal, ...rest }) => rest);

    // Calculate totals only for internal display
    const calculatedData = calculateTotals(newData, suppliers);
    setInternalData(calculatedData);

    // Pass only regular data without totals to parent
    onChange?.(regularData);
  };

  const columns = [
    columnHelper.accessor('stt', {
      header: () => (
        <div className="flex h-full items-center justify-center p-1">STT</div>
      ),
      cell: info =>
        info.row.original.isSubTotal ||
        info.row.original.isVAT ||
        info.row.original.isFinalTotal
          ? ''
          : info.getValue()
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
      columns: suppliers.map(supplier =>
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
      columns: suppliers.map(supplier =>
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
    onAddSupplier?.(newSupplier);

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

    // Scroll to new supplier after render
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

  return (
    <div className="space-y-4">
      <button
        onClick={addSupplier}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Thêm nhà cung cấp
      </button>

      <div
        ref={tableRef}
        className="border-appBlue overflow-x-auto rounded-md border"
      >
        <Table>
          <TableHeader className="sticky top-0 z-10">
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
                Mô tả công việc mới thầu
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
                colSpan={suppliers.length}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Đơn giá
              </TableHead>
              <TableHead
                colSpan={suppliers.length}
                className="bg-appBlueLight text-appWhite relative whitespace-nowrap p-2 text-center after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r after:content-['']"
              >
                Thành tiền
              </TableHead>
            </TableRow>
            <TableRow className="!border-b-0">
              {suppliers.map(supplier => (
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
                        onRemoveSupplier?.(supplier);
                      }}
                      className="text-red-300 hover:text-red-100"
                    >
                      ×
                    </button>
                  </div>
                </TableHead>
              ))}
              {suppliers.map(supplier => (
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
}

interface EditableCellProps {
  value: number | string | '';
  onChange: (value: string) => void;
}

function EditableCell({ value, onChange }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  // Update localValue when value prop changes
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
}
