import {
  FileMinusIcon,
  FilePlusIcon,
  FileTextIcon,
  GearIcon
} from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { LucideHome, PackagePlusIcon } from 'lucide-react';
import { object, string } from 'yup';

import { FC, ReactNode, useState } from 'react';

import { DocumentRecord, DocumentStatusOptions, usePb } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  SideBar,
  SideBarGroup,
  SideBarItem,
  TextField
} from '@storeo/theme';

import { CustomerDropdownField, Header } from '../components';

const EmptyIcon = () => <span></span>;

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

export type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pb = usePb();
  const queryClient = useQueryClient();

  const createDocument = useMutation({
    mutationKey: ['createDocument'],
    mutationFn: (params: DocumentRecord) =>
      pb.collection<DocumentRecord>('document').create(params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
        navigate({
          to: '/document/mine',
          search: {
            pageIndex: 1,
            pageSize: 10,
            filter: ''
          }
        })
      ]),
    onSettled: () => setOpen(false)
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-1/4">
          <DialogHeader>
            <DialogTitle>Tạo tài liệu</DialogTitle>
            <DialogDescription>Tạo tài liệu chính.</DialogDescription>
          </DialogHeader>
          <Form
            schema={schema}
            onSubmit={values =>
              createDocument.mutate({
                ...values,
                status: DocumentStatusOptions.ToDo,
                createdBy: pb.authStore.model?.id
              })
            }
            defaultValues={{
              name: '',
              bidding: '',
              customer: ''
            }}
            loading={createDocument.isPending}
            className={'mt-4 flex flex-col gap-3'}
          >
            <TextField
              schema={schema}
              name={'bidding'}
              title={'Tên gói thầu'}
              options={{}}
            />
            <TextField
              schema={schema}
              name={'name'}
              title={'Tên công trình'}
              options={{}}
            />
            <CustomerDropdownField
              schema={schema}
              name={'customer'}
              title={'Chủ đầu tư'}
              options={{
                placeholder: 'Hãy chọn chủ đầu tư'
              }}
            />
            <DialogFooter className={'mt-4'}>
              <Button type="submit">Chấp nhận</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
      <div className={'flex h-screen w-full flex-col'}>
        <Header />
        <div className={'flex h-full w-full grow'}>
          <SideBar>
            <div className={'w-full border-b p-2'}>
              <Button
                className={
                  'flex w-full gap-2 bg-green-600 uppercase hover:bg-green-500'
                }
                onClick={() => setOpen(true)}
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
