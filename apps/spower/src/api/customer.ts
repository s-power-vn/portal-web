import { InferType, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import { Collections, CustomerRecord, client } from '@storeo/core';

export const CustomersSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type CustomersSearch = InferType<typeof CustomersSearchSchema>;

export const customerApi = router('customer', {
  listFull: router.query({
    fetcher: () =>
      client.collection(Collections.Customer).getFullList({
        sort: '-created'
      })
  }),
  list: router.query({
    fetcher: (search?: CustomersSearch) => {
      const filter = `(name ~ "${search?.filter ?? ''}" || email ~ "${search?.filter ?? ''}")`;
      return client
        .collection(Collections.Customer)
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: '-created'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Customer).getOne(id)
  }),
  create: router.mutation({
    mutationFn: (params: CustomerRecord) =>
      client.collection(Collections.Customer).create(params)
  }),
  update: router.mutation({
    mutationFn: (params: CustomerRecord & { id: string }) =>
      client.collection(Collections.Customer).update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Customer).delete(id)
  })
});
