import { useNavigate, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';
import { currentUserId } from 'portal-core';

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

import { forceRefreshAuth } from '../../routes/auth/auth-cache';

export const HeaderMenu = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const { data: user } = api.user.byId.useSuspenseQuery({
    variables: currentUserId.value
  });

  const logout = api.auth.logout.useMutation({
    onSuccess: async () => {
      await router.invalidate();
      navigate({ to: '/signin' });
    }
  });

  const handleProfile = useCallback(
    () =>
      navigate({
        to: '/profile'
      }),
    [navigate]
  );

  const handleSwitchOrganization = useCallback(() => {
    localStorage.removeItem('organizationId');
    forceRefreshAuth();
    navigate({
      to: '/'
    });
  }, [navigate]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar} />
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
        <DropdownMenuItem onClick={handleSwitchOrganization}>
          Chuyển đổi tổ chức
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleProfile}>Cài đặt</DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout.mutate()}>
          Đăng xuất
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
