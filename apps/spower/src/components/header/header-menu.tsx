import { client } from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`http://localhost:8090/api/files/user/${client.authStore.model?.id}/${client.authStore.model?.avatar}`}
          />
          <AvatarFallback className={'text-sm'}>
            {client.authStore.model?.name.split(' ')[0][0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'w-56'}>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {client.authStore.model?.name}
            </p>
            <p className="text-muted-foreground text-xs font-normal leading-none">
              {client.authStore.model?.email}
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
