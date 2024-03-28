import {
  FileMinusIcon,
  FilePlusIcon,
  FileTextIcon,
  GearIcon
} from '@radix-ui/react-icons';
import { LucideHome, PackagePlusIcon } from 'lucide-react';

import { FC, ReactNode, useState } from 'react';

import {
  Badge,
  Button,
  SideBar,
  SideBarGroup,
  SideBarItem
} from '@storeo/theme';

import { DocumentNew, Header } from '../components';

const EmptyIcon = () => <span></span>;

export type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [openDocumentNew, setOpenDocumentNew] = useState(false);

  return (
    <>
      <DocumentNew open={openDocumentNew} setOpen={setOpenDocumentNew} />
      <div className={'flex h-screen w-full flex-col'}>
        <Header />
        <div className={'flex h-full w-full grow'}>
          <SideBar>
            <div className={'w-full border-b p-2'}>
              <Button
                className={
                  'flex w-full gap-2 bg-green-600 uppercase hover:bg-green-500'
                }
                onClick={() => setOpenDocumentNew(true)}
              >
                <PackagePlusIcon />
                Tạo tài liệu
              </Button>
            </div>
            <SideBarItem
              to={'/home'}
              icon={<LucideHome width={22} height={22} />}
            ></SideBarItem>
            <SideBarGroup
              to={'/general'}
              title={'Quản lý chung'}
              icon={<GearIcon width={22} height={22} />}
            >
              <SideBarItem
                to={'/general/employees'}
                icon={<EmptyIcon />}
              ></SideBarItem>
              <SideBarItem
                to={'/general/customers'}
                icon={<EmptyIcon />}
              ></SideBarItem>
              <SideBarItem
                to={'/general/suppliers'}
                icon={<EmptyIcon />}
              ></SideBarItem>
            </SideBarGroup>
            <SideBarItem
              to={'/document/waiting'}
              icon={<FileTextIcon width={22} height={22} />}
              badge={<Badge className={'bg-red-500'}>1</Badge>}
            ></SideBarItem>
            <SideBarItem
              to={'/document/mine'}
              icon={<FilePlusIcon width={22} height={22} />}
            ></SideBarItem>
            <SideBarItem
              to={'/document/all'}
              icon={<FileMinusIcon width={22} height={22} />}
            ></SideBarItem>
          </SideBar>
          <div className={'h-full grow overflow-hidden p-2'}>{children}</div>
        </div>
      </div>
    </>
  );
};
