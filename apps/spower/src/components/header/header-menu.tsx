import { useNavigate } from '@tanstack/react-router';
import { api } from 'portal-api';
import { Collections, getImageUrl, getUser } from 'portal-core';

import { useCallback } from 'react';

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
} from '@minhdtb/storeo-theme';

export const HeaderMenu = () => {
  const navigate = useNavigate();
  const user = getUser();

  const logout = api.auth.logout.useMutation({
    onSuccess: () => navigate({ to: '/login' })
  });

  const handleProfile = useCallback(
    () =>
      navigate({
        to: '/user/profile'
      }),
    [navigate]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={getImageUrl(Collections.User, user?.id, user?.avatar)}
          />
          <AvatarFallback className={'text-sm'}>
            {user?.name.split(' ')[0][0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'w-56'} sideOffset={12}>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-muted-foreground text-xs font-normal leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile}>Cài đặt</DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout.mutate()}>
          Đăng xuất
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
