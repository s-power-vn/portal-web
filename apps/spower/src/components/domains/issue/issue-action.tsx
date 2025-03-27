/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader } from 'lucide-react';
import { api } from 'portal-api';
import { client } from 'portal-core';

import type { FC } from 'react';
import { Suspense, useCallback, useMemo } from 'react';

import { For, Show, cn } from '@minhdtb/storeo-core';
import { Button, showModal, useConfirm } from '@minhdtb/storeo-theme';

import { ForwardIssueForm, ReturnIssueForm } from '.';
import { useInvalidateQueries } from '../../../hooks';
import {
  Node,
  ProcessData,
  extractStatus,
  getNode,
  getNodeFromFlows
} from '../flow';
import { FinishIssueForm } from './form/finish-issue-form';

export type IssueActionProps = {
  issueId: string;
};

const ActionComponent: FC<IssueActionProps> = props => {
  const invalidates = useInvalidateQueries();

  const issue = api.issue.byId.useSuspenseQuery({
    variables: props.issueId
  });

  const approve = api.issue.approve.useMutation({
    onSuccess: () => {
      invalidates([
        api.issue.byId.getKey(props.issueId),
        api.comment.list.getKey(props.issueId)
      ]);
    }
  });

  const unApprove = api.issue.unApprove.useMutation({
    onSuccess: () => {
      invalidates([
        api.issue.byId.getKey(props.issueId),
        api.comment.list.getKey(props.issueId)
      ]);
    }
  });

  const { confirm } = useConfirm();

  const issueObject = issue.data.expand?.object;

  const process = issueObject?.expand?.process;

  const currentNode = useMemo(() => {
    const extracted = extractStatus(issue.data.status);
    const currentNode = extracted?.to ? extracted.to : extracted?.from;
    return currentNode
      ? getNode(process?.process as ProcessData, currentNode)
      : undefined;
  }, [issue.data.status, process]);

  const toList = useMemo(() => {
    if (!currentNode) {
      return [];
    }

    return getNodeFromFlows(
      process?.process as ProcessData,
      currentNode.id
    ).map(it => {
      const nodeInfo = getNode(process?.process as ProcessData, it.to.node);

      return {
        ...extractStatus(it.id),
        id: it.id,
        to: it.to.node,
        status: it.id,
        action: it.action,
        toNode: nodeInfo
      };
    });
  }, [currentNode]);

  const extracted = extractStatus(issue.data.status);

  const returnFlow = toList.find(it => extracted?.from === it.to);

  const forwardFlows = toList.filter(it => extracted?.from !== it.to);

  const returnNodeClick = useCallback(() => {
    if (!returnFlow) {
      return;
    }

    showModal({
      title: returnFlow?.action ?? 'Chuyển trả',
      children: ({ close }) => {
        return (
          <ReturnIssueForm
            issueId={props.issueId}
            status={returnFlow?.status}
            onCancel={close}
            onSuccess={() => {
              invalidates([
                api.issue.byId.getKey(props.issueId),
                api.request.listFinished.getKey(),
                api.comment.list.getKey(props.issueId)
              ]);
              close();
            }}
          />
        );
      }
    });
  }, [invalidates, props.issueId, returnFlow]);

  const forwardNodeClick = useCallback(
    <
      T extends {
        id: string;
        action?: string;
        status: string;
        to: string;
        toNode?: Node;
      }
    >(
      flow: T
    ) => {
      if (!flow) {
        return;
      }

      if (flow.toNode?.type === 'finish') {
        showModal({
          title: flow.action ?? `Hoàn thành`,
          children: ({ close }) => {
            return (
              <FinishIssueForm
                issueId={props.issueId}
                status={flow.status}
                onCancel={close}
                onSuccess={() => {
                  invalidates([
                    api.issue.byId.getKey(props.issueId),
                    api.request.listFinished.getKey(),
                    api.comment.list.getKey(props.issueId)
                  ]);
                  close();
                }}
              />
            );
          }
        });
      } else {
        showModal({
          title: flow.action ?? `Chuyển ${flow.toNode?.name}`,
          children: ({ close }) => {
            return (
              <ForwardIssueForm
                issueId={props.issueId}
                status={flow.status}
                node={flow.toNode}
                onCancel={close}
                onSuccess={() => {
                  invalidates([
                    api.issue.byId.getKey(props.issueId),
                    api.request.listFinished.getKey(),
                    api.comment.list.getKey(props.issueId)
                  ]);
                  close();
                }}
              />
            );
          }
        });
      }
    },
    [invalidates, props.issueId]
  );

  const handleApproveChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        confirm('Bạn chắc chắn muốn phê duyệt công việc này?', () => {
          if (forwardFlows.length === 0) {
            return;
          }

          const flow = forwardFlows[0];

          showModal({
            title: flow.action ?? `Chuyển ${flow.toNode?.name}`,
            children: ({ close }) => {
              return (
                <ForwardIssueForm
                  issueId={props.issueId}
                  status={flow.status}
                  node={flow.toNode}
                  onCancel={close}
                  onSuccess={() => {
                    approve.mutate({
                      id: props.issueId,
                      nodeName: currentNode?.name ?? '',
                      nodeId: currentNode?.id ?? '',
                      userId: client.authStore.record?.id ?? '',
                      userName: client.authStore.record?.name ?? ''
                    });

                    invalidates([
                      api.issue.byId.getKey(props.issueId),
                      api.request.listFinished.getKey(),
                      api.comment.list.getKey(props.issueId)
                    ]);
                    close();
                  }}
                />
              );
            }
          });
        });
      } else {
        confirm('Bạn chắc chắn muốn từ chối công việc này?', () => {
          if (!returnFlow) {
            return;
          }

          showModal({
            title: returnFlow?.action ?? 'Từ chối',
            children: ({ close }) => {
              return (
                <ReturnIssueForm
                  issueId={props.issueId}
                  status={returnFlow?.status}
                  onCancel={close}
                  onSuccess={() => {
                    unApprove.mutate({
                      id: props.issueId,
                      nodeId: currentNode?.id ?? ''
                    });

                    invalidates([
                      api.issue.byId.getKey(props.issueId),
                      api.request.listFinished.getKey(),
                      api.comment.list.getKey(props.issueId)
                    ]);
                    close();
                  }}
                />
              );
            }
          });
        });
      }
    },
    [
      approve,
      currentNode?.id,
      currentNode?.name,
      props.issueId,
      unApprove,
      confirm
    ]
  );

  return (
    <div className={'flex flex-col gap-3 border-t p-2'}>
      <Show
        when={currentNode?.type === 'approval'}
        fallback={
          <div className={'grid grid-cols-5 gap-2'}>
            <Show when={returnFlow}>
              <Button
                truncate
                onClick={returnNodeClick}
                className={cn([
                  returnFlow?.toNode?.type === 'normal' &&
                    'bg-appError hover:bg-appErrorLight',
                  returnFlow?.toNode?.type === 'finish' &&
                    'bg-appSuccess hover:bg-appSuccessLight'
                ])}
              >
                {returnFlow?.action ?? 'Chuyển trả'}
              </Button>
            </Show>
            <For each={forwardFlows}>
              {item => {
                return (
                  <Button
                    truncate
                    key={item.to}
                    onClick={() => forwardNodeClick(item)}
                    className={cn(
                      item.toNode?.type === 'finish' &&
                        'bg-appSuccess hover:bg-appSuccessLight'
                    )}
                  >
                    {item.action ?? `Chuyển ${item.toNode?.name}`}
                  </Button>
                );
              }}
            </For>
          </div>
        }
      >
        <div className={'grid grid-cols-5 gap-2'}>
          <Button
            className="bg-appSuccess hover:bg-appSuccessLight"
            onClick={() => handleApproveChange(true)}
          >
            Phê duyệt
          </Button>
          <Button
            className="bg-appError hover:bg-appErrorLight"
            onClick={() => handleApproveChange(false)}
          >
            Từ chối
          </Button>
        </div>
      </Show>
    </div>
  );
};

export const IssueAction: FC<IssueActionProps> = props => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-2">
          <Loader className={'h-4 w-4 animate-spin'} />
        </div>
      }
    >
      <ActionComponent {...props} />
    </Suspense>
  );
};
