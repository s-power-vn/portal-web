import {
  Collections,
  MsgChannelTypeOptions,
  MsgChatTypeOptions,
  MsgMessageTypeOptions,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

// Type definitions for chat entities
export type ChatTeam = {
  id: string;
  name: string;
  owner: string;
  members: string[];
  logo: string;
  created: string;
  updated: string;
};

export type ChatChannel = {
  id: string;
  name: string;
  team: string;
  type: MsgChannelTypeOptions;
  description: string;
  created: string;
  updated: string;
};

export type ChatRoom = {
  id: string;
  type: MsgChatTypeOptions;
  participants: string[];
  team: string;
  channel: string;
  lastMessage: string;
  pinnedMessages: string[];
  created: string;
  updated: string;
};

export type ChatMessage = {
  id: string;
  chat: string;
  sender: string;
  content: string;
  type: MsgMessageTypeOptions;
  file: string;
  replyTo: string;
  metadata: Record<string, any>;
  created: string;
  updated: string;
};

export type ChatReaction = {
  id: string;
  message: string;
  user: string;
  emojiCode: string;
  created: string;
  updated: string;
};

export type ChatSetting = {
  id: string;
  user: string;
  chat: string;
  lastRead: string;
  mute: boolean;
  created: string;
  updated: string;
};

// Expanding these types with relations for API responses
export type ChatTeamWithMembers = ChatTeam & {
  expand?: {
    members: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
    owner: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
};

export type ChatChannelWithTeam = ChatChannel & {
  expand?: {
    team: ChatTeam;
  };
};

export type ChatRoomWithDetails = ChatRoom & {
  expand?: {
    participants: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
    team?: ChatTeam;
    channel?: ChatChannel;
    lastMessage?: ChatMessageWithSender;
  };
};

export type ChatMessageWithSender = ChatMessage & {
  expand?: {
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
    replyTo?: ChatMessageWithSender;
  };
};

// Define the chat API
export const chatApi = router('chat', {
  // Teams
  listTeams: router.query({
    fetcher: (userId: string) => {
      return client.collection(Collections.MsgTeam).getFullList({
        filter: `members ?~ "${userId}" || owner = "${userId}"`,
        sort: '-updated'
      });
    }
  }),

  getTeam: router.query({
    fetcher: (id: string) => {
      return client.collection(Collections.MsgTeam).getOne(id, {
        expand: 'members,owner'
      });
    }
  }),

  createTeam: router.mutation({
    mutationFn: (data: { name: string; members: string[]; logo?: string }) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      return client.collection(Collections.MsgTeam).create({
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

      return client.collection(Collections.MsgTeam).update(data.id, updateData);
    }
  }),

  // Channels
  listChannels: router.query({
    fetcher: (teamId: string) => {
      return client.collection(Collections.MsgChannel).getFullList({
        filter: `team = "${teamId}"`,
        sort: 'name'
      });
    }
  }),

  getChannel: router.query({
    fetcher: (id: string) => {
      return client.collection(Collections.MsgChannel).getOne(id, {
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
      return client.collection(Collections.MsgChannel).create({
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
        .collection(Collections.MsgChannel)
        .update(data.id, updateData);
    }
  }),

  // Chat Rooms
  listChats: router.query({
    fetcher: (userId: string) => {
      return client.collection(Collections.MsgChat).getFullList({
        filter: `participants ?~ "${userId}"`,
        expand: 'lastMessage,lastMessage.sender',
        sort: '-updated'
      });
    }
  }),

  getChatsByTeam: router.query({
    fetcher: (teamId: string) => {
      return client.collection(Collections.MsgChat).getFullList({
        filter: `team = "${teamId}"`,
        expand: 'lastMessage,lastMessage.sender',
        sort: '-updated'
      });
    }
  }),

  getChatsByChannel: router.query({
    fetcher: (channelId: string) => {
      return client.collection(Collections.MsgChat).getFullList({
        filter: `channel = "${channelId}"`,
        expand: 'lastMessage,lastMessage.sender',
        sort: '-updated'
      });
    }
  }),

  getChat: router.query({
    fetcher: (id: string) => {
      return client.collection(Collections.MsgChat).getOne(id, {
        expand: 'participants,team,channel,lastMessage,lastMessage.sender'
      });
    }
  }),

  createChat: router.mutation({
    mutationFn: async (data: {
      type: MsgChatTypeOptions;
      participants: string[];
      teamId?: string;
      channelId?: string;
    }) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      // Make sure current user is included
      if (!data.participants.includes(currentUser)) {
        data.participants.push(currentUser);
      }

      const chatData: Record<string, any> = {
        type: data.type,
        participants: data.participants,
        team: data.teamId || '',
        channel: data.channelId || '',
        pinnedMessages: []
      };

      return client.collection(Collections.MsgChat).create(chatData);
    }
  }),

  updateChat: router.mutation({
    mutationFn: (data: {
      id: string;
      participants?: string[];
      pinnedMessages?: string[];
    }) => {
      const updateData: Record<string, any> = {};
      if (data.participants) updateData.participants = data.participants;
      if (data.pinnedMessages) updateData.pinnedMessages = data.pinnedMessages;

      return client.collection(Collections.MsgChat).update(data.id, updateData);
    }
  }),

  // Messages
  listMessages: router.query({
    fetcher: (params: { chatId: string; page?: number; limit?: number }) => {
      return client
        .collection(Collections.MsgMessage)
        .getList(params.page || 1, params.limit || 50, {
          filter: `chat = "${params.chatId}"`,
          expand: 'sender,replyTo,replyTo.sender',
          sort: 'created'
        });
    }
  }),

  sendMessage: router.mutation({
    mutationFn: (data: {
      chatId: string;
      content: string;
      type?: MsgMessageTypeOptions;
      file?: string;
      replyTo?: string;
      metadata?: Record<string, any>;
    }) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      // Update chat's lastActivity timestamp
      client.collection(Collections.MsgChat).update(data.chatId, {
        updated: new Date().toISOString()
      });

      const messageData: Record<string, any> = {
        chat: data.chatId,
        sender: currentUser,
        content: data.content,
        type: data.type || MsgMessageTypeOptions.Text,
        file: data.file || '',
        replyTo: data.replyTo || '',
        metadata: data.metadata || null
      };

      return client
        .collection(Collections.MsgMessage)
        .create(messageData)
        .then(async message => {
          // Update the last message reference in the chat
          await client.collection(Collections.MsgChat).update(data.chatId, {
            lastMessage: message.id
          });
          return message;
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
        .collection(Collections.MsgMessage)
        .update(data.id, updateData);
    }
  }),

  deleteMessage: router.mutation({
    mutationFn: (id: string) => {
      // Instead of hard deleting, we update metadata to mark it as deleted
      return client.collection(Collections.MsgMessage).update(id, {
        metadata: { isDeleted: true },
        content: '',
        updated: new Date().toISOString()
      });
    }
  }),

  // Message Reactions
  addReaction: router.mutation({
    mutationFn: (data: { messageId: string; emojiCode: string }) => {
      const currentUser = client.authStore.record?.id;
      if (!currentUser) throw new Error('User not authenticated');

      return client.collection(Collections.MsgReaction).create({
        message: data.messageId,
        user: currentUser,
        emojiCode: data.emojiCode
      });
    }
  }),

  removeReaction: router.mutation({
    mutationFn: (id: string) => {
      return client.collection(Collections.MsgReaction).delete(id);
    }
  }),

  listReactions: router.query({
    fetcher: (messageId: string) => {
      return client.collection(Collections.MsgReaction).getFullList({
        filter: `message = "${messageId}"`,
        expand: 'user'
      });
    }
  }),

  // Chat Settings
  getChatSettings: router.query({
    fetcher: (params: { userId: string; chatId: string }) => {
      return client
        .collection(Collections.MsgSetting)
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
        // Try to get existing settings
        const settings = await client
          .collection(Collections.MsgSetting)
          .getFirstListItem(
            `user = "${currentUser}" && chat = "${data.chatId}"`
          );

        // Update existing settings
        return client
          .collection(Collections.MsgSetting)
          .update(settings.id, updateData);
      } catch (error) {
        // Create new settings if none exist
        return client.collection(Collections.MsgSetting).create({
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
        // Try to get existing settings
        const settings = await client
          .collection(Collections.MsgSetting)
          .getFirstListItem(`user = "${currentUser}" && chat = "${chatId}"`);

        // Update existing settings
        return client.collection(Collections.MsgSetting).update(settings.id, {
          lastRead: now
        });
      } catch (error) {
        // Create new settings if none exist
        return client.collection(Collections.MsgSetting).create({
          user: currentUser,
          chat: chatId,
          lastRead: now,
          mute: false
        });
      }
    }
  })
});

// Subscription functions (outside of the router)
export const subscribeToChat = (chatId: string, callback: () => void) => {
  return client
    .collection(Collections.MsgMessage)
    .subscribe(`chat="${chatId}"`, callback);
};

export const subscribeToChats = (userId: string, callback: () => void) => {
  return client
    .collection(Collections.MsgChat)
    .subscribe(`participants ?~ "${userId}"`, callback);
};

export const subscribeToChannel = (channelId: string, callback: () => void) => {
  return client
    .collection(Collections.MsgChat)
    .subscribe(`channel="${channelId}"`, callback);
};

export const subscribeToTeam = (teamId: string, callback: () => void) => {
  return client
    .collection(Collections.MsgTeam)
    .subscribe(`id="${teamId}"`, callback);
};
