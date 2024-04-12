import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteIcon, FileSpreadsheetIcon } from 'lucide-react';

import { FC, useRef } from 'react';

import { Collections, ContractItemStatusOptions, client } from '@storeo/core';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@storeo/theme';

import {
  getContractItemById,
  getContractItemByIdKey,
  getRequestByIdKey
} from '../../../api';
import { ContractStatusDropdown } from './contract-status-dropdown';

export type ContractItemProps = {
  requestId: string;
  contractId: string;
  index: number;
  itemId?: string;
};

export const ContractItem: FC<ContractItemProps> = ({
  requestId,
  contractId,
  index,
  itemId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          .collection(Collections.ContractItem)
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

  const addContractItemFile = useMutation({
    mutationKey: ['addContractItemFile'],
    mutationFn: async (params: { files: FileList }) => {
      let id = itemId;
      if (!id) {
        const record = await client
          .collection(Collections.ContractItem)
          .create({
            contract: contractId,
            index,
            status: ContractItemStatusOptions.ToDo
          });
        id = record.id;
      }
      for (const file of params.files) {
        const formData = new FormData();
        formData.append('name', file.name);
        formData.append('file', file);
        formData.append('contractItem', id);
        await client.collection(Collections.ContractItemFile).create(formData, {
          requestKey: null
        });
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getContractItemByIdKey(itemId ?? '')
        }),
        queryClient.invalidateQueries({
          queryKey: getRequestByIdKey(requestId)
        })
      ]);
    }
  });

  const deleteContractItemFile = useMutation({
    mutationKey: ['deleteContractItemFile'],
    mutationFn: async (params: { fileId: string }) => {
      await client
        .collection(Collections.ContractItemFile)
        .delete(params.fileId);
      if (itemId) {
        let totalItems = 0;
        try {
          const info = await client
            .collection(Collections.ContractItemFile)
            .getList(1, 1, {
              filter: `contractItem = "${itemId}"`,
              requestKey: null
            });
          totalItems = info.totalItems;
        } catch (_) {
          /**/
        }
        if (totalItems === 0) {
          await client.collection(Collections.ContractItem).delete(itemId);
        }
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getContractItemByIdKey(itemId ?? '')
        }),
        queryClient.invalidateQueries({
          queryKey: getRequestByIdKey(requestId)
        })
      ]);
    }
  });

  return (
    <div className={'flex items-center justify-between'}>
      <div className={'flex'}>
        <div className={'flex items-center border-r pl-1 pr-2'}>
          <input
            ref={fileInputRef}
            type={'file'}
            className={'hidden'}
            multiple
            onChange={() => {
              const files = fileInputRef.current?.files;

              if (files) {
                addContractItemFile.mutate({ files });
              }
            }}
          />
          <Button
            size={'icon'}
            variant={'ghost'}
            className={'p-2'}
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <PlusCircledIcon className={'h-full w-full'} />
          </Button>
        </div>
        <div className={'flex flex-col items-center justify-center p-2'}>
          {item.data &&
          item.data.expand?.contractItemFile_via_contractItem &&
          item.data.expand?.contractItemFile_via_contractItem.length > 0 ? (
            <div className={'flex items-center gap-2'}>
              <span>
                {item.data.expand.contractItemFile_via_contractItem.length}
              </span>
              <span>x</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'ghost'} size={'icon'}>
                    <FileSpreadsheetIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={'flex flex-col gap-1 text-sm'}>
                  {item.data.expand.contractItemFile_via_contractItem.map(
                    (it, index) => (
                      <div
                        key={it.id}
                        className={'flex w-full items-center justify-between'}
                      >
                        <a
                          href={`${it.file}`}
                          target={'_blank'}
                          className={'flex w-52 w-full gap-1'}
                        >
                          <span>{`${index + 1}.`}</span>
                          <span className={'truncate'}>{it.name}</span>
                        </a>
                        <Button
                          size={'icon'}
                          variant={'destructive'}
                          className={
                            'bg-appError h-6 w-6 rounded-full p-0 p-1 text-white'
                          }
                          onClick={() => {
                            deleteContractItemFile.mutate({
                              fileId: it.id
                            });
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    )
                  )}
                </PopoverContent>
              </Popover>
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
