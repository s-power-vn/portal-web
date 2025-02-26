import { ObjectData } from 'libs/api/src/api/object';
import {
  CheckIcon,
  DollarSignIcon,
  FileTextIcon,
  PlusIcon,
  ShoppingCartIcon
} from 'lucide-react';
import { api } from 'portal-api';
import { ObjectTypeOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Match, Switch } from '@minhdtb/storeo-core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeButton,
  showModal
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';
import { NewPriceForm } from '../price';
import { NewRequestForm } from '../request';

export type NewIssueButtonProps = {
  projectId: string;
};

export const NewIssueButton: FC<NewIssueButtonProps> = ({ projectId }) => {
  const invalidates = useInvalidateQueries();
  const listObjects = api.object.listFullActive.useSuspenseQuery();

  const handleNewRequestClick = useCallback(
    (objectId: string) => {
      showModal({
        title: 'Tạo yêu cầu mua hàng',
        className: 'flex min-w-[1000px] flex-col',
        description:
          'Tạo yêu cầu mua hàng mới. Cho phép chọn từ danh sách hạng mục',
        children: ({ close }) => {
          return (
            <NewRequestForm
              projectId={projectId}
              objectId={objectId}
              onSuccess={async () => {
                await invalidates([
                  api.issue.list.getKey({
                    projectId
                  }),
                  api.issue.listMine.getKey({
                    projectId
                  }),
                  api.issue.listRequest.getKey({
                    projectId
                  })
                ]);
                close();
              }}
              onCancel={close}
            />
          );
        }
      });
    },
    [invalidates, projectId]
  );

  const handleNewPriceRequestClick = useCallback(
    (objectId: string) => {
      showModal({
        title: 'Tạo yêu cầu đơn giá',
        className: 'flex min-w-[1000px] flex-col',
        description:
          'Tạo yêu cầu đơn giá mới. Cho phép chọn từ danh sách hạng mục',
        children: ({ close }) => {
          return (
            <NewPriceForm
              projectId={projectId}
              objectId={objectId}
              onSuccess={async () => {
                await invalidates([
                  api.issue.list.getKey({
                    projectId
                  }),
                  api.issue.listMine.getKey({
                    projectId
                  }),
                  api.issue.listRequest.getKey({
                    projectId
                  })
                ]);
                close();
              }}
              onCancel={close}
            />
          );
        }
      });
    },
    [invalidates, projectId]
  );

  const handleObjectClick = useCallback(
    (object: ObjectData) => {
      switch (object.type) {
        case ObjectTypeOptions.Request:
          handleNewRequestClick(object.id);
          break;
        case ObjectTypeOptions.Price:
          handleNewPriceRequestClick(object.id);
          break;
        case ObjectTypeOptions.Document:
          break;
        case ObjectTypeOptions.Task:
          break;
      }
    },
    [handleNewRequestClick, handleNewPriceRequestClick]
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ThemeButton className={'flex gap-1'}>
          <PlusIcon className={'h-5 w-5'} />
          Thêm công việc
        </ThemeButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        side="bottom"
        align="start"
        sideOffset={2}
      >
        {listObjects.data?.length ? (
          listObjects.data?.map(object => (
            <DropdownMenuItem
              key={object.id}
              onClick={() => handleObjectClick(object)}
            >
              <Switch>
                <Match when={object.type === ObjectTypeOptions.Request}>
                  <ShoppingCartIcon className="mr-2 h-4 w-4 text-red-500" />
                </Match>
                <Match when={object.type === ObjectTypeOptions.Price}>
                  <DollarSignIcon className="mr-2 h-4 w-4 text-blue-500" />
                </Match>
                <Match when={object.type === ObjectTypeOptions.Document}>
                  <FileTextIcon className="mr-2 h-4 w-4 text-green-500" />
                </Match>
                <Match when={object.type === ObjectTypeOptions.Task}>
                  <CheckIcon className="mr-2 h-4 w-4 text-purple-500" />
                </Match>
              </Switch>
              {object.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>
            <span className="text-xs text-gray-500">
              Không có đối tượng tạo công việc
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
