/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'portal-api';
import { IssueTypeOptions, client } from 'portal-core';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { For, Show, cn } from '@minhdtb/storeo-core';
import { Button, Checkbox, error, showModal } from '@minhdtb/storeo-theme';

import { ForwardIssueForm, ReturnIssueForm } from '.';
import { useInvalidateQueries } from '../../../hooks';
import {
  extractStatus,
  getNode,
  getNodeFromFlows,
  isApproveNode,
  isDoneNode
} from '../flow';
import { FinishIssueForm } from './form/finish-issue-form';

export type IssueActionProps = {
  issueId: string;
};

export const IssueAction: FC<IssueActionProps> = props => {
  const invalidates = useInvalidateQueries();
  const [isApproved, setIsApproved] = useState(false);

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

  const currentNode = useMemo(() => {
    const type =
      issue.data.type === IssueTypeOptions.Request ? 'request' : 'price';
    const extracted = extractStatus(issue.data.status);
    const currentNode = extracted?.to ? extracted.to : extracted?.from;
    return currentNode ? getNode(type, currentNode) : undefined;
  }, [issue.data.status]);

  const toList = useMemo(() => {
    const type =
      issue.data.type === IssueTypeOptions.Request ? 'request' : 'price';

    if (!currentNode) {
      return [];
    }

    return getNodeFromFlows(type, currentNode.id).map(it => {
      const nodeInfo = getNode(type, it.to.node);

      return {
        ...extractStatus(it.id),
        id: it.id,
        to: it.to.node,
        status: it.id,
        action: it.action,
        toNode: nodeInfo,
        isApprove: it.approve ?? false
      };
    });
  }, [currentNode]);

  const extracted = extractStatus(issue.data.status);

  const returnNode = toList.find(it => extracted?.from === it.to);

  const forwardNodes = toList.filter(it => extracted?.from !== it.to);

  const returnNodeClick = useCallback(() => {
    if (!returnNode) {
      return;
    }

    showModal({
      title: returnNode?.action ?? 'Chuyển trả',
      children: ({ close }) => {
        return (
          <ReturnIssueForm
            issueId={props.issueId}
            status={returnNode?.status}
            onCancel={close}
            onSuccess={() => {
              invalidates([
                api.issue.byId.getKey(props.issueId),
                api.comment.list.getKey(props.issueId)
              ]);
              close();
            }}
          />
        );
      }
    });
  }, [invalidates, props.issueId, returnNode]);

  const forwardNodeClick = useCallback(
    <
      T extends {
        id: string;
        action?: string;
        status: string;
        to: string;
        toNode?: { name: string; condition?: string };
        isApprove: boolean;
      }
    >(
      flow: T
    ) => {
      if (!flow) {
        return;
      }

      if (flow.isApprove) {
        if (!isApproved) {
          error('Bạn chưa duyệt công việc này');
          return;
        }
      }

      if (
        isDoneNode(
          issue.data.type === IssueTypeOptions.Request ? 'request' : 'price',
          flow.to
        )
      ) {
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
                title={`${flow.toNode?.name}`}
                status={flow.status}
                condition={flow.toNode?.condition}
                onCancel={close}
                onSuccess={() => {
                  invalidates([
                    api.issue.byId.getKey(props.issueId),
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
    [invalidates, props.issueId, isApproved]
  );

  useEffect(() => {
    const approver = issue.data.approver?.find(
      it => it.userId === client.authStore.model?.id
    );

    setIsApproved(!!approver);
  }, [issue.data.approver]);

  const handleApproveChange = useCallback(
    (checked: boolean) => {
      setIsApproved(checked);
      if (checked) {
        approve.mutate({
          id: props.issueId,
          nodeName: currentNode?.name ?? '',
          nodeId: currentNode?.id ?? '',
          userId: client.authStore.model?.id ?? '',
          userName: client.authStore.model?.name ?? ''
        });
      } else {
        unApprove.mutate({
          id: props.issueId,
          nodeId: currentNode?.id ?? ''
        });
      }
    },
    [approve, currentNode?.id, currentNode?.name, props.issueId, unApprove]
  );

  const isApproveNodeActive = isApproveNode(
    issue.data.type === IssueTypeOptions.Request ? 'request' : 'price',
    currentNode?.id
  );

  return (
    <div className={'mt-1 flex flex-col gap-3 border-b p-2'}>
      <Show when={isApproveNodeActive}>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isApproved}
            onCheckedChange={handleApproveChange}
            id="approve-checkbox"
          />
          <label htmlFor="approve-checkbox" className="text-sm">
            {isApproved ? 'Đã duyệt' : 'Chưa duyệt công việc này'}
          </label>
        </div>
      </Show>
      <div className={'flex items-center gap-2'}>
        <Show when={returnNode}>
          <Button onClick={returnNodeClick} className="bg-appError">
            {returnNode?.action ?? 'Chuyển trả'}
          </Button>
        </Show>
        <For each={forwardNodes}>
          {item => {
            return (
              <Button
                key={item.to}
                onClick={() => forwardNodeClick(item)}
                className={cn(
                  isDoneNode(
                    issue.data.type === IssueTypeOptions.Request
                      ? 'request'
                      : 'price',
                    item.to
                  ) && 'bg-appSuccess'
                )}
              >
                {item.action ?? `Chuyển ${item.toNode?.name}`}
              </Button>
            );
          }}
        </For>
      </div>
    </div>
  );
};
