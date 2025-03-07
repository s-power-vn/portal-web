import { RecordSubscription } from 'pocketbase';
import {
  Collections,
  MsgChannelResponse,
  MsgChannelTypeOptions,
  MsgChatResponse,
  MsgChatTypeOptions,
  MsgMessageRecord,
  MsgMessageResponse,
  MsgReactionResponse,
  MsgSettingResponse,
  MsgTeamResponse,
  MsgUnreadResponse,
  UserResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

export type MsgTeam = MsgTeamResponse<{
  members: UserResponse[];
  owner: UserResponse;
}>;

export type MsgChannel = MsgChannelResponse<{
  team: MsgTeam;
}>;

export type MsgChat = MsgChatResponse<
  Record<string, string>,
  {
    lastMessage: MsgMessage;
    participants: UserResponse[];
    team: MsgTeam;
    channel: MsgChannel;
  }
>;

export type MsgMessage = MsgMessageResponse<
  Record<string, string>,
  {
    sender: UserResponse;
    replyTo: MsgMessage;
  }
>;

export type MsgReaction = MsgReactionResponse<{
  user: UserResponse;
}>;

export type MsgSetting = MsgSettingResponse<{
  user: UserResponse;
  chat: MsgChat;
}>;

export const chatApi = router('chat', {
  listTeams: router.query({
    fetcher: (userId: string) => {
      return client.collection<MsgTeam>(Collections.MsgTeam).getFullList({
        filter: `members ?~ "${userId}" || owner = "${userId}"`,
        sort: '-updated'
      });
    }
  }),

  getTeam: router.query({
    fetcher: (id: string) => {
      return client.collection<MsgTeam>(Collections.MsgTeam).getOne(id, {
        expand: 'members,owner'
      });
    }
  }),

  createTeam: router.mutation({
    mutationFn: (data: { name: string; members: string[]; logo?: string }) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      return client.collection<MsgTeam>(Collections.MsgTeam).create({
        name: data.name,
        owner: currentUser,
        members: data.members,
        logo: data.logo || ''
      });
    }
  }),

  updateTeam: router.mutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      logo?: string;
      members?: string[];
    }) => {
      const updateData: Record<string, any> = {};
      if (data.name) updateData.name = data.name;
      if (data.logo) updateData.logo = data.logo;
      if (data.members) updateData.members = data.members;

      return client
        .collection<MsgTeam>(Collections.MsgTeam)
        .update(data.id, updateData);
    }
  }),

  listChannels: router.query({
    fetcher: (teamId: string) => {
      return client.collection<MsgChannel>(Collections.MsgChannel).getFullList({
        filter: `team = "${teamId}"`,
        sort: 'name'
      });
    }
  }),

  getChannel: router.query({
    fetcher: (id: string) => {
      return client.collection<MsgChannel>(Collections.MsgChannel).getOne(id, {
        expand: 'team'
      });
    }
  }),

  createChannel: router.mutation({
    mutationFn: (data: {
      teamId: string;
      name: string;
      type: MsgChannelTypeOptions;
      description?: string;
    }) => {
      return client.collection<MsgChannel>(Collections.MsgChannel).create({
        team: data.teamId,
        name: data.name,
        type: data.type,
        description: data.description || ''
      });
    }
  }),

  updateChannel: router.mutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      description?: string;
      type?: MsgChannelTypeOptions;
    }) => {
      const updateData: Record<string, any> = {};
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.type) updateData.type = data.type;

      return client
        .collection<MsgChannel>(Collections.MsgChannel)
        .update(data.id, updateData);
    }
  }),

  listDirectChats: router.query({
    fetcher: (params: { userId: string; page?: number; perPage?: number }) => {
      return client
        .collection<MsgChat>(Collections.MsgChat)
        .getList(params.page || 1, params.perPage || 20, {
          filter: `participants ?~ "${params.userId}" && (type = "${MsgChatTypeOptions.Private}" || type = "${MsgChatTypeOptions.Group}")`,
          expand: 'lastMessage,lastMessage.sender,participants',
          sort: '-updated'
        });
    }
  }),

  getChatsByTeam: router.query({
    fetcher: (teamId: string) => {
      return client.collection<MsgChat>(Collections.MsgChat).getFullList({
        filter: `team = "${teamId}"`,
        expand: 'lastMessage,lastMessage.sender,participants',
        sort: '-updated'
      });
    }
  }),

  getChatsByChannel: router.query({
    fetcher: (channelId: string) => {
      return client.collection<MsgChat>(Collections.MsgChat).getFullList({
        filter: `channel = "${channelId}"`,
        expand: 'lastMessage,lastMessage.sender',
        sort: '-updated'
      });
    }
  }),

  getChat: router.query({
    fetcher: (id: string) => {
      return client.collection<MsgChat>(Collections.MsgChat).getOne(id, {
        expand: 'participants,team,channel,lastMessage,lastMessage.sender'
      });
    }
  }),

  createChat: router.mutation({
    mutationFn: async (params: {
      type: MsgChatTypeOptions;
      participants: string[];
      teamId?: string;
      channelId?: string;
      name?: string;
    }) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      if (!params.participants.includes(currentUser)) {
        params.participants.push(currentUser);
      }

      const stringParticipants = params.participants.sort().join(',');

      const encoder = new TextEncoder();
      const data = encoder.encode(stringParticipants);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const chat = await client
        .collection<MsgChat>(Collections.MsgChat)
        .getFullList({
          filter: `hash = "${hash}"`
        });

      if (chat.length > 0) {
        return chat[0];
      }

      const chatData: Record<string, any> = {
        type: params.type,
        participants: params.participants,
        team: params.teamId || '',
        channel: params.channelId || '',
        pinnedMessages: [],
        name: params.name || '',
        hash
      };

      return client.collection<MsgChat>(Collections.MsgChat).create(chatData);
    }
  }),

  updateChatName: router.mutation({
    mutationFn: (params: { id: string; name: string }) => {
      const updateData: Record<string, any> = {};
      if (params.name) updateData.name = params.name;

      return client
        .collection<MsgChat>(Collections.MsgChat)
        .update(params.id, updateData);
    }
  }),

  listMessages: router.query({
    fetcher: (params: { chatId: string; page?: number; perPage?: number }) => {
      return client
        .collection<MsgMessage>(Collections.MsgMessage)
        .getList(params.page || 1, params.perPage || 50, {
          filter: `chat = "${params.chatId}"`,
          expand: 'sender,replyTo,replyTo.sender',
          sort: '-created'
        });
    }
  }),

  sendMessage: router.mutation({
    mutationFn: (data: Partial<MsgMessageRecord>) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      return client.send('/send-message', {
        method: 'POST',
        body: {
          ...data,
          sender: currentUser
        },
        requestKey: null
      });
    }
  }),

  updateMessage: router.mutation({
    mutationFn: (data: {
      id: string;
      content?: string;
      metadata?: Record<string, any>;
    }) => {
      const updateData: Record<string, any> = {
        updated: new Date().toISOString()
      };

      if (data.content !== undefined) updateData.content = data.content;
      if (data.metadata !== undefined) updateData.metadata = data.metadata;

      return client
        .collection<MsgMessage>(Collections.MsgMessage)
        .update(data.id, updateData);
    }
  }),

  deleteMessage: router.mutation({
    mutationFn: (id: string) => {
      return client.collection<MsgMessage>(Collections.MsgMessage).update(id, {
        metadata: { isDeleted: true },
        content: '',
        updated: new Date().toISOString()
      });
    }
  }),

  addReaction: router.mutation({
    mutationFn: (data: { messageId: string; emojiCode: string }) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      return client.collection<MsgReaction>(Collections.MsgReaction).create({
        message: data.messageId,
        user: currentUser,
        emojiCode: data.emojiCode
      });
    }
  }),

  removeReaction: router.mutation({
    mutationFn: (id: string) => {
      return client.collection<MsgReaction>(Collections.MsgReaction).delete(id);
    }
  }),

  listReactions: router.query({
    fetcher: (messageId: string) => {
      return client
        .collection<MsgReaction>(Collections.MsgReaction)
        .getFullList({
          filter: `message = "${messageId}"`,
          expand: 'user'
        });
    }
  }),

  getChatSettings: router.query({
    fetcher: (params: { userId: string; chatId: string }) => {
      return client
        .collection<MsgSetting>(Collections.MsgSetting)
        .getFirstListItem(
          `user = "${params.userId}" && chat = "${params.chatId}"`
        )
        .catch(() => null);
    }
  }),

  updateChatSettings: router.mutation({
    mutationFn: async (data: {
      chatId: string;
      lastRead?: string;
      mute?: boolean;
    }) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      const updateData: Record<string, any> = {};
      if (data.lastRead) updateData.lastRead = data.lastRead;
      if (data.mute !== undefined) updateData.mute = data.mute;

      try {
        const settings = await client
          .collection<MsgSetting>(Collections.MsgSetting)
          .getFirstListItem(
            `user = "${currentUser}" && chat = "${data.chatId}"`
          );

        return client
          .collection<MsgSetting>(Collections.MsgSetting)
          .update(settings.id, updateData);
      } catch (error) {
        return client.collection<MsgSetting>(Collections.MsgSetting).create({
          user: currentUser,
          chat: data.chatId,
          lastRead: data.lastRead || new Date().toISOString(),
          mute: data.mute || false
        });
      }
    }
  }),

  markChatAsRead: router.mutation({
    mutationFn: async (chatId: string) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      const now = new Date().toISOString();

      try {
        const settings = await client
          .collection<MsgSetting>(Collections.MsgSetting)
          .getFirstListItem(`user = "${currentUser}" && chat = "${chatId}"`, {
            requestKey: null
          });

        return client.collection<MsgSetting>(Collections.MsgSetting).update(
          settings.id,
          {
            lastRead: now
          },
          {
            requestKey: null
          }
        );
      } catch (error) {
        return client.collection<MsgSetting>(Collections.MsgSetting).create({
          user: currentUser,
          chat: chatId,
          lastRead: now,
          mute: false
        });
      }
    }
  }),

  getUnreadCount: router.query({
    fetcher: async (params: { userId?: string; chatId?: string }) => {
      if (params.userId) {
        try {
          let filter = `userId = "${params.userId}"`;
          if (params.chatId) filter += ` && chatId = "${params.chatId}"`;

          const unread = await client
            .collection<MsgUnreadResponse<number>>(Collections.MsgUnread)
            .getFullList({
              filter,
              requestKey: null
            });

          return unread.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
        } catch (error) {
          return 0;
        }
      }

      return 0;
    }
  })
});

export const subscribeMessages = (
  chatId: string,
  callback: (value: RecordSubscription<MsgMessage>) => void
) => {
  return client
    .collection<MsgMessage>(Collections.MsgMessage)
    .subscribe(`*`, callback, {
      filter: `chat = "${chatId}"`
    });
};

export const subscribeChats = (
  userId: string,
  callback: (value: RecordSubscription<MsgChat>) => void
) => {
  return client
    .collection<MsgChat>(Collections.MsgChat)
    .subscribe(`*`, callback, {
      filter: `participants ?~ "${userId}"`
    });
};

export const subscribeToChannel = (channelId: string, callback: () => void) => {
  return client
    .collection<MsgChat>(Collections.MsgChat)
    .subscribe(`channel="${channelId}"`, callback);
};

export const subscribeToTeam = (teamId: string, callback: () => void) => {
  return client
    .collection<MsgTeam>(Collections.MsgTeam)
    .subscribe(`id="${teamId}"`, callback);
};

export const subscribeSettings = (
  userId: string,
  callback: (value: RecordSubscription<MsgSetting>) => void
) => {
  return client
    .collection<MsgSetting>(Collections.MsgSetting)
    .subscribe(`*`, callback, {
      filter: `user = "${userId}"`
    });
};
