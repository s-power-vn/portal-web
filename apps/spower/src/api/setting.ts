import { router } from 'react-query-kit';

import {
  Collections,
  SettingResponse,
  UserResponse,
  client
} from '@storeo/core';

export type SettingData = SettingResponse & {
  expand: {
    user: UserResponse;
  };
};

export const settingApi = router('setting', {
  listConfirmer: router.query({
    fetcher: () =>
      client.collection<SettingData>(Collections.Setting).getFullList({
        filter: 'type = "Confirmer"',
        expand: 'user'
      })
  }),
  listApprover: router.query({
    fetcher: () =>
      client.collection<SettingData>(Collections.Setting).getFullList({
        filter: 'type = "Approver"',
        expand: 'user'
      })
  }),
  addConfirmer: router.mutation({
    mutationFn: async (params: { user: string }) =>
      client.collection<SettingData>(Collections.Setting).create({
        ...params,
        type: 'Confirmer'
      })
  }),
  addApprover: router.mutation({
    mutationFn: async (params: { user: string }) =>
      client.collection<SettingData>(Collections.Setting).create({
        ...params,
        type: 'Approver'
      })
  }),
  deleteConfirmer: router.mutation({
    mutationFn: async (id: string) =>
      client.collection<SettingData>(Collections.Setting).delete(id)
  }),
  deleteApprover: router.mutation({
    mutationFn: async (id: string) =>
      client.collection<SettingData>(Collections.Setting).delete(id)
  })
});
