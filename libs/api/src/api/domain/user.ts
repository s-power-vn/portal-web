import { client, client2 } from 'portal-core';

import { router } from 'react-query-kit';

export const userApi = router('user', {
  update: router.mutation({
    mutationFn: (params: {
      id: string;
      name?: string;
      avatar?: string | File;
    }) => {
      const formData = new FormData();
      if (params.avatar && typeof params.avatar !== 'string') {
        formData.append('avatar', params.avatar);
      }
      if (params.name) {
        formData.append('name', params.name);
      }
      return client.collection('user').update(params.id, formData);
    }
  }),
  changePassword: router.mutation({
    mutationFn: (params: {
      id: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      return client.send('/user/change-password', {
        method: 'PUT',
        body: params
      });
    }
  }),
  sendEmailOtp: router.mutation({
    mutationFn: (params: { email: string }) => {
      return client2.api.sendEmailOtp(params);
    }
  }),
  verifyEmailOtp: router.mutation({
    mutationFn: (params: { email: string; code: string }) => {
      return client2.api.verifyEmailOtp(params);
    }
  }),
  registerUserInformation: router.mutation({
    mutationFn: (params: {
      email: string;
      name: string;
      phone?: string;
      address?: string;
    }) => {
      return client2.api.registerUserInformation(params);
    }
  }),
  getRestToken: router.mutation({
    mutationFn: (params: { email: string }) => {
      return client2.api.getRestToken(params);
    }
  }),
  emailLogin: router.mutation({
    mutationFn: (params: { email: string; password: string }) => {
      return client2.api.emailLogin(params);
    }
  }),
  emailRegister: router.mutation({
    mutationFn: (params: { email: string; password: string }) => {
      return client2.api.emailRegister(params);
    }
  }),
  checkUser: router.query({
    fetcher: () => {
      return client2.api.checkUser();
    }
  })
});
