import {
  BackpackIcon,
  FileIcon,
  FileMinusIcon,
  FilePlusIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
  PersonIcon
} from '@radix-ui/react-icons';
import { StoreIcon } from 'lucide-react';

import { FC, ReactNode } from 'react';

import { SideBar, SideBarGroup, SideBarItem } from '@storeo/theme';

import { Header } from '../components';

export type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className={'flex h-screen w-screen flex-col'}>
      <Header />
      <div className={'flex h-full w-full'}>
        <SideBar>
          <SideBarItem
            to={'/home'}
            title={'Trang chủ'}
            icon={<HomeIcon width={22} height={22} />}
          ></SideBarItem>
          <SideBarGroup
            to={'/general'}
            title={'Quản lý chung'}
            icon={<GearIcon width={22} height={22} />}
          >
            <SideBarItem
              to={'/general/employees'}
              title={'Quản lý nhân viên'}
              icon={<></>}
            ></SideBarItem>
            <SideBarItem
              to={'/general/customers'}
              title={'Quản lý chủ đầu tư'}
              icon={<></>}
            ></SideBarItem>
            <SideBarItem
              to={'/general/suppliers'}
              title={'Quản lý nhà cung cấp'}
              icon={<></>}
            ></SideBarItem>
          </SideBarGroup>
          <SideBarItem
            to={'/document-wating'}
            title={'Đang chờ xử lý'}
            icon={<FileTextIcon width={22} height={22} />}
          ></SideBarItem>
          <SideBarItem
            to={'/document-mine'}
            title={'Tài liệu của tôi'}
            icon={<FilePlusIcon width={22} height={22} />}
          ></SideBarItem>
          <SideBarItem
            to={'/document-all'}
            title={'Tất cả tài liệu'}
            icon={<FileMinusIcon width={22} height={22} />}
          ></SideBarItem>
        </SideBar>
        <div className={'h-full w-full p-2'}>{children}</div>
      </div>
    </div>
  );
};
