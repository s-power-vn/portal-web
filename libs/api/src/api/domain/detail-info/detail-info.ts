import {
  Collections,
  DetailInfoResponse,
  IssueResponse,
  RequestResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

export const detailInfoApi = router('detailInfo', {
  listFull: router.query({
    fetcher: (projectId: string) =>
      client
        .collection<
          DetailInfoResponse & {
            expand: {
              request: RequestResponse;
              issue: IssueResponse;
            };
          }
        >(Collections.DetailInfo)
        .getFullList({
          filter: `project = "${projectId}"`,
          expand: 'request,issue',
          sort: '-created'
        })
  })
});
