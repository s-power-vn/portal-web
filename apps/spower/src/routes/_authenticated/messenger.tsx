import { createFileRoute } from '@tanstack/react-router';
import { UserRound, Users } from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@minhdtb/storeo-theme';

import { PageHeader } from '../../components';
import { GroupChat } from '../../components/messenger/group-chat';
import { PrivateChat } from '../../components/messenger/private-chat';

const Component = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-none">
        <PageHeader title="Tin nhắn" />
      </div>
      <Tabs
        defaultValue="direct"
        className="flex w-full flex-1 flex-col overflow-hidden"
      >
        <TabsList className="grid w-full flex-none grid-cols-2 gap-1 rounded-none">
          <TabsTrigger value="direct">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              <span>Tin nhắn trực tiếp</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="group">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Nhóm</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="mt-0 flex-1 overflow-hidden">
          <PrivateChat />
        </TabsContent>

        <TabsContent value="group" className="mt-0 flex-1 overflow-hidden">
          <GroupChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/messenger')({
  component: Component,
  beforeLoad: () => ({ title: 'Tin nhắn' })
});
