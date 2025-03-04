import { client } from 'portal-core';

import { router } from 'react-query-kit';

// Type definitions for chat entities
export type ChatChannel = {
  id: string;
  name: string;
  type: 'direct' | 'group';
  created: string;
  updated: string;
  isArchived: boolean;
};

export type ChatChannelMember = {
  id: string;
  channel: string;
  user: string;
  joined: string;
  role: 'admin' | 'member';
  isBlocked: boolean;
};

export type ChatMessage = {
  id: string;
  channel: string;
  sender: string;
  content: string;
  created: string;
  updated: string;
  isDeleted: boolean;
  readBy: string[]; // Array of user IDs
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
  reactions: Record<string, { count: number; users: string[] }>;
  replyTo?: string;
};

// Expanding these types with relations for API responses
export type ChatChannelWithMembers = ChatChannel & {
  expand?: {
    members: ChatChannelMember[];
  };
};

export type ChatMessageWithSender = ChatMessage & {
  expand?: {
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
};

// Define the chat API
export const chatApi = router('chat', {
  // Channels
  listChannels: router.query({
    fetcher: (userId: string) => {
      return client.collection('chatChannel').getFullList({
        filter: `members.user="${userId}"`,
        expand: 'members',
        sort: '-updated'
      });
    }
  }),

  getChannel: router.query({
    fetcher: (id: string) => {
      return client.collection('chatChannel').getOne(id, {
        expand: 'members'
      });
    }
  }),

  createChannel: router.mutation({
    mutationFn: async (data: {
      name: string;
      type: 'direct' | 'group';
      members: string[];
    }) => {
      // Create the channel
      const channel = await client.collection('chatChannel').create({
        name: data.name,
        type: data.type,
        isArchived: false
      });

      // Add members to the channel
      const memberPromises = data.members.map(userId => {
        return client.collection('chatChannelMember').create({
          channel: channel.id,
          user: userId,
          role: userId === client.authStore.model?.id ? 'admin' : 'member',
          isBlocked: false
        });
      });

      await Promise.all(memberPromises);

      return channel;
    }
  }),

  updateChannel: router.mutation({
    mutationFn: (data: { id: string; name?: string; isArchived?: boolean }) => {
      return client.collection('chatChannel').update(data.id, {
        name: data.name,
        isArchived: data.isArchived
      });
    }
  }),

  // Channel Members
  addMember: router.mutation({
    mutationFn: (data: {
      channelId: string;
      userId: string;
      role?: 'admin' | 'member';
    }) => {
      return client.collection('chatChannelMember').create({
        channel: data.channelId,
        user: data.userId,
        role: data.role || 'member',
        isBlocked: false
      });
    }
  }),

  removeMember: router.mutation({
    mutationFn: (id: string) => {
      return client.collection('chatChannelMember').delete(id);
    }
  }),

  updateMemberRole: router.mutation({
    mutationFn: (data: { id: string; role: 'admin' | 'member' }) => {
      return client.collection('chatChannelMember').update(data.id, {
        role: data.role
      });
    }
  }),

  // Messages
  listMessages: router.query({
    fetcher: (params: { channelId: string; page?: number; limit?: number }) => {
      return client
        .collection('chatMessage')
        .getList(params.page || 1, params.limit || 50, {
          filter: `channel="${params.channelId}" && isDeleted=false`,
          expand: 'sender',
          sort: 'created'
        });
    }
  }),

  sendMessage: router.mutation({
    mutationFn: (data: {
      channelId: string;
      content: string;
      attachments?: Array<{
        id: string;
        name: string;
        type: string;
        url: string;
        size: number;
      }>;
      replyTo?: string;
    }) => {
      const currentUser = client.authStore.model?.id;
      if (!currentUser) throw new Error('User not authenticated');

      // Update channel's lastActivity timestamp
      client.collection('chatChannel').update(data.channelId, {
        updated: new Date().toISOString()
      });

      return client.collection('chatMessage').create({
        channel: data.channelId,
        sender: currentUser,
        content: data.content,
        readBy: [currentUser],
        attachments: data.attachments || [],
        reactions: {},
        replyTo: data.replyTo,
        isDeleted: false
      });
    }
  }),

  updateMessage: router.mutation({
    mutationFn: (data: { id: string; content: string }) => {
      return client.collection('chatMessage').update(data.id, {
        content: data.content,
        updated: new Date().toISOString()
      });
    }
  }),

  deleteMessage: router.mutation({
    mutationFn: (id: string) => {
      return client.collection('chatMessage').update(id, {
        isDeleted: true
      });
    }
  }),

  markAsRead: router.mutation({
    mutationFn: (data: { messageId: string; userId: string }) => {
      // Get the current message
      return client
        .collection('chatMessage')
        .getOne(data.messageId)
        .then(message => {
          const readBy = message.readBy || [];
          if (!readBy.includes(data.userId)) {
            readBy.push(data.userId);
            return client.collection('chatMessage').update(data.messageId, {
              readBy
            });
          }
          return message;
        });
    }
  }),

  addReaction: router.mutation({
    mutationFn: (data: {
      messageId: string;
      reaction: string;
      userId: string;
    }) => {
      return client
        .collection('chatMessage')
        .getOne(data.messageId)
        .then(message => {
          const reactions = message.reactions || {};
          if (!reactions[data.reaction]) {
            reactions[data.reaction] = { count: 0, users: [] };
          }

          // Only add if not already added
          if (!reactions[data.reaction].users.includes(data.userId)) {
            reactions[data.reaction].count += 1;
            reactions[data.reaction].users.push(data.userId);

            return client.collection('chatMessage').update(data.messageId, {
              reactions
            });
          }

          return message;
        });
    }
  }),

  removeReaction: router.mutation({
    mutationFn: (data: {
      messageId: string;
      reaction: string;
      userId: string;
    }) => {
      return client
        .collection('chatMessage')
        .getOne(data.messageId)
        .then(message => {
          const reactions = message.reactions || {};
          if (
            reactions[data.reaction] &&
            reactions[data.reaction].users.includes(data.userId)
          ) {
            reactions[data.reaction].count -= 1;
            reactions[data.reaction].users = reactions[
              data.reaction
            ].users.filter(id => id !== data.userId);

            // Remove the reaction entirely if no users have it
            if (reactions[data.reaction].count <= 0) {
              delete reactions[data.reaction];
            }

            return client.collection('chatMessage').update(data.messageId, {
              reactions
            });
          }

          return message;
        });
    }
  })
});

// Subscription functions (outside of the router)
export const subscribeToChannel = (channelId: string, callback: () => void) => {
  return client
    .collection('chatMessage')
    .subscribe(`channel="${channelId}"`, callback);
};

export const subscribeToChannels = (userId: string, callback: () => void) => {
  return client
    .collection('chatChannel')
    .subscribe(`members.user="${userId}"`, callback);
};
