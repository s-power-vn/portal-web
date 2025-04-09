import { User, client2 } from 'portal-core';

import { router } from 'react-query-kit';

export const userApi = router('user', {
  byId: router.query({
    fetcher: async (id: string) => {
      const { data, error } = await client2.rest
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as User;
    }
  }),
  update: router.mutation({
    mutationFn: async (params: {
      id: string;
      name?: string;
      avatar?: string | File;
    }) => {
      return;
    }
  }),
  changePassword: router.mutation({
    mutationFn: async (params: {
      id: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      return;
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
  getRestToken: router.query({
    fetcher: (params?: string) => {
      return client2.api.getRestToken(params);
    }
  }),
  emailLogin: router.mutation({
    mutationFn: (params: { email: string; password: string }) => {
      return client2.api.emailLogin(params);
    }
  }),
  googleLogin: router.mutation({
    mutationFn: () => {
      return client2.api.googleLogin();
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
