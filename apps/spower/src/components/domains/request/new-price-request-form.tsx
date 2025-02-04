import type { FC } from 'react';
import { useState } from 'react';

import type { PriceInputData } from '../../table/price-table';
import { PriceTable } from '../../table/price-table';

const defaultData: PriceInputData[] = [
  {
    code: 'Sắt D6 CB-240T',
    volume: 3935.12,
    unit: 'kg',
    estimate: 23264210,
    prices: {
      'Nhật Long 1': 13536,
      'Nhật Long 2': 13674,
      'Nam Sài Gòn': 14000
    }
  }
];

interface NewPriceRequestFormProps {
  projectId: string;
  onSuccess: () => void;
}

export const NewPriceRequestForm: FC<NewPriceRequestFormProps> = ({
  projectId,
  onSuccess
}) => {
  const [data, setData] = useState<PriceInputData[]>(defaultData);
  const [suppliers, setSuppliers] = useState<string[]>([]);

  const handleDataChange = (newData: PriceInputData[]) => {
    console.log('newData', newData);
  };

  const handleAddSupplier = (newSupplier: string) => {
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const handleRemoveSupplier = (supplier: string) => {
    setSuppliers(prev => prev.filter(s => s !== supplier));

    // Remove supplier data from price data
    setData(prev =>
      prev.map(row => {
        const { [supplier]: _, ...restPrices } = row.prices;
        return {
          ...row,
          prices: restPrices
        };
      })
    );
  };

  return (
    <PriceTable
      data={data}
      suppliers={suppliers}
      onChange={handleDataChange}
      onAddSupplier={handleAddSupplier}
      onRemoveSupplier={handleRemoveSupplier}
    />
  );
};
