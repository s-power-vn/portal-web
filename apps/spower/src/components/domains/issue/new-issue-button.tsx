import { PlusIcon } from 'lucide-react';
import { ObjectData, api } from 'portal-api';

import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeButton,
  showModal
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';
import { DynamicIcon } from '../../icon/dynamic-icon';
import { NewPriceForm } from '../price';
import { NewRequestForm } from '../request';

export type NewIssueButtonProps = {
  projectId: string;
};

export const NewIssueButton: FC<NewIssueButtonProps> = ({ projectId }) => {
  const invalidates = useInvalidateQueries();
  const listObjects = api.object.listFullActive.useSuspenseQuery();
  const objectTypes = api.objectType.listFull.useQuery();

  const typeMap = useMemo(() => {
    if (!objectTypes.data) return new Map();

    return new Map(objectTypes.data.map(type => [type.id, type]));
  }, [objectTypes.data]);

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
              onSuccess={() => {
                invalidates([
                  api.issue.list.getKey({
                    projectId
                  }),
                  api.issue.listMine.getKey({
                    projectId
                  }),
                  api.issue.listByObjectType.getKey({
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
        title: 'Tạo đề nghị báo giá',
        className: 'flex min-w-[1000px] flex-col',
        description:
          'Tạo đề nghị báo giá mới. Cho phép chọn từ danh sách hạng mục',
        children: ({ close }) => {
          return (
            <NewPriceForm
              projectId={projectId}
              objectId={objectId}
              onSuccess={() => {
                invalidates([
                  api.issue.list.getKey({
                    projectId
                  }),
                  api.issue.listMine.getKey({
                    projectId
                  }),
                  api.issue.listByObjectType.getKey({
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
      const type = typeMap.get(object.type)?.name;

      if (type === 'Request') {
        handleNewRequestClick(object.id);
      } else if (type === 'Price') {
        handleNewPriceRequestClick(object.id);
      }
    },
    [handleNewRequestClick, handleNewPriceRequestClick, typeMap]
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
          listObjects.data?.map(object => {
            const type = typeMap.get(object.type);

            return (
              <DropdownMenuItem
                key={object.id}
                onClick={() => handleObjectClick(object)}
              >
                <DynamicIcon
                  svgContent={type?.icon}
                  className="mr-2 h-4 w-4"
                  style={{ color: type?.color || '#6b7280' }}
                />
                {object.name}
              </DropdownMenuItem>
            );
          })
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
