import { usePb } from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@storeo/theme';

import { useLogout } from '../../api';

export const HeaderMenu = () => {
  const pb = usePb();
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`http://localhost:8090/api/files/users/${pb.authStore.model?.id}/${pb.authStore.model?.avatar}`}
          />
          <AvatarFallback className={'text-sm'}>
            {pb.authStore.model?.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'w-56'}>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {pb.authStore.model?.name}
            </p>
            <p className="text-muted-foreground text-xs font-normal leading-none">
              {pb.authStore.model?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Cài đặt</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout.mutate();
          }}
        >
          Đăng xuất
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
