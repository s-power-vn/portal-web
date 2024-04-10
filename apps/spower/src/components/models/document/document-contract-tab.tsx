import { FC } from 'react';

import { RequestResponse } from '@storeo/core';

import { RequestItem } from '../request/request-item';

export type DocumentContractProps = {
  documentId: string;
};

export const DocumentContractTab: FC<DocumentContractProps> = ({
  documentId
}) => {
  return (
    <div
      className={
        'bg-appGrayLight flex h-[calc(100vh-215px)] flex-col gap-4 overflow-auto rounded-md border p-4'
      }
    ></div>
  );
};
