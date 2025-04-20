import { DownloadIcon, Loader } from 'lucide-react';
import { api } from 'portal-api';
import {
  Collections,
  IssueFileResponse,
  client,
  formatFileSize,
  getFileIcon
} from 'portal-core';

import type { FC } from 'react';
import { Suspense, useCallback, useEffect, useState } from 'react';

import { Button } from '@minhdtb/storeo-theme';

export type IssueAttachmentProps = {
  issueId: string;
};

const isImageFile = (type: string | undefined) => {
  return type?.startsWith('image/') ?? false;
};

const AttachmentComponent: FC<IssueAttachmentProps> = ({ issueId }) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadFileUrls = async () => {
      const urls: Record<string, string> = {};
      for (const file of issue.data?.files || []) {
        if (isImageFile(file.type)) {
          const fileData = await client
            .collection<IssueFileResponse>(Collections.IssueFile)
            .getOne(file.id);
          urls[file.id] = client.files.getURL(fileData, fileData.upload);
        }
      }
      setFileUrls(urls);
    };

    loadFileUrls();
  }, [issue.data?.files]);

  const handleDownload = useCallback(
    async (fileId: string, fileName?: string) => {
      const file = await client
        .collection<IssueFileResponse>(Collections.IssueFile)
        .getOne(fileId);

      const fileUrl = client.files.getURL(file, file.upload);

      const response = await fetch(fileUrl, {
        headers: {
          Authorization: 'Bearer ' + client.authStore.token
        }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName ?? file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    []
  );

  return (
    <div className={'flex w-full flex-col gap-4 p-4'}>
      {issue.data?.files?.length ? (
        <div
          className={
            'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
          }
        >
          {issue.data.files.map(file => (
            <div
              key={file.id}
              className={'flex flex-col rounded-lg border p-3'}
            >
              {isImageFile(file.type) ? (
                <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md">
                  {fileUrls[file.id] && (
                    <img
                      src={fileUrls[file.id]}
                      alt={file.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
              ) : null}
              <div className={'flex items-center justify-between'}>
                <div className={'flex min-w-0 flex-1 items-center gap-2'}>
                  {!isImageFile(file.type) && getFileIcon(file.type)}
                  <div className={'flex min-w-0 flex-1 flex-col'}>
                    <span className={'truncate text-sm font-medium'}>
                      {file.name}
                    </span>
                    <span className={'text-xs text-gray-500'}>
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 flex-shrink-0"
                  onClick={() => handleDownload(file.id, file.name)}
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={'flex h-40 items-center justify-center'}>
          <span className={'text-gray-500'}>Không có file đính kèm</span>
        </div>
      )}
    </div>
  );
};

export const IssueAttachment: FC<IssueAttachmentProps> = props => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <Loader className={'h-4 w-4 animate-spin'} />
        </div>
      }
    >
      <AttachmentComponent {...props} />
    </Suspense>
  );
};
