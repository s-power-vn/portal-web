import { createFileRoute } from '@tanstack/react-router';
import { UserRound, Users } from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@minhdtb/storeo-theme';

import { PageHeader } from '../../components';
import { DirectChat } from '../../components/messenger/direct-chat';
import { GroupChat } from '../../components/messenger/group-chat';

const Component = () => {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Tin nhắn" />
      <Tabs defaultValue="direct" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 gap-1 rounded-none">
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

        <TabsContent value="direct" className="flex-1">
          <DirectChat />
        </TabsContent>

        <TabsContent value="group" className="flex-1">
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
