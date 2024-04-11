import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileSpreadsheetIcon } from 'lucide-react';

import { FC } from 'react';

import { Collections, ContractItemStatusOptions, client } from '@storeo/core';
import { Button } from '@storeo/theme';

import {
  ContractItemData,
  getContractItemById,
  getContractItemByIdKey,
  getRequestByIdKey
} from '../../../api';
import { ContractStatusDropdown } from './contract-status-dropdown';

export type ContractItemProps = {
  requestId: string;
  itemId?: string;
};

export const ContractItem: FC<ContractItemProps> = ({ requestId, itemId }) => {
  const item = useQuery({
    ...getContractItemById(itemId!),
    enabled: !!itemId
  });

  const queryClient = useQueryClient();

  const updateContractItem = useMutation({
    mutationKey: ['updateContractItem', itemId],
    mutationFn: async (params: { status: ContractItemStatusOptions }) => {
      if (itemId) {
        return await client
          .collection<ContractItemData>(Collections.ContractItem)
          .update(itemId, params);
      }
    },
    onSuccess: async () => {
      if (itemId) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getContractItemByIdKey(itemId)
          }),
          queryClient.invalidateQueries({
            queryKey: getRequestByIdKey(requestId)
          })
        ]);
      }
    }
  });

  return (
    <div className={'flex items-center justify-between'}>
      <div className={'flex'}>
        <div className={'flex items-center border-r pl-1 pr-2'}>
          <Button size={'icon'} className={''}>
            <PlusCircledIcon className={'h-4 w-4'} />
          </Button>
        </div>
        <div className={'flex flex-col items-center justify-center p-2'}>
          {item.data &&
          item.data.expand.contractItemFile_via_contractItem &&
          item.data.expand.contractItemFile_via_contractItem.length > 0 ? (
            <div className={'flex gap-2'}>
              <span>
                {item.data.expand.contractItemFile_via_contractItem.length}
              </span>
              <span>x</span>
              <FileSpreadsheetIcon />
            </div>
          ) : (
            <span className={' text-sm italic text-gray-500'}>
              Chưa có tài liệu nào
            </span>
          )}
        </div>
      </div>
      <div className={'border-l px-2'}>
        {item.data ? (
          <ContractStatusDropdown
            value={item.data.status}
            onChange={value => {
              if (value !== item.data.status) {
                updateContractItem.mutate({
                  status:
                    value === 'ToDo'
                      ? ContractItemStatusOptions.ToDo
                      : ContractItemStatusOptions.Done
                });
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
