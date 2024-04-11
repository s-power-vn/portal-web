import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';

import { FC } from 'react';

import { Collections, ContractItemResponse, client } from '@storeo/core';

export type ContractItemProps = {
  itemId?: string;
};

export const ContractItem: FC<ContractItemProps> = ({ itemId }) => {
  const item = useQuery({
    queryKey: ['getContractItem', itemId],
    queryFn: () => {
      if (itemId) {
        return client
          .collection<ContractItemResponse>(Collections.ContractItem)
          .getOne(itemId);
      }
    },
    enabled: !!itemId
  });

  return (
    <div className={'flex'}>
      <div className={'border-r p-3'}>
        <PlusCircledIcon className={'h-4 w-4'} />
      </div>
      <div>{item.data ? <></> : <span>No data</span>}</div>
    </div>
  );
};
