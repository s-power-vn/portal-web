/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'portal-api';

import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

import { For, Show, cn } from '@minhdtb/storeo-core';
import { Button, showModal } from '@minhdtb/storeo-theme';

import { ForwardIssueForm, ReturnIssueForm } from '.';
import { IssueTypeOptions } from '../../../../../../libs/core/src';
import { useInvalidateQueries } from '../../../hooks';
import {
  extractStatus,
  getNode,
  getNodeFromFlows,
  isDoneNode
} from '../../flow';
import { FinishIssueForm } from './form/finish-issue-form';

export type IssueActionProps = {
  issueId: string;
};

export const IssueAction: FC<IssueActionProps> = props => {
  const invalidates = useInvalidateQueries();

  const issue = api.issue.byId.useSuspenseQuery({
    variables: props.issueId
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
        to: it.to.node,
        status: it.id,
        action: it.action,
        toNode: nodeInfo
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
        action?: string;
        status: string;
        to: string;
        toNode?: { name: string; condition?: string };
      }
    >(
      node: T
    ) => {
      if (!node) {
        return;
      }

      if (
        isDoneNode(
          issue.data.type === IssueTypeOptions.Request ? 'request' : 'price',
          node.to
        )
      ) {
        showModal({
          title: node.action ?? `Hoàn thành`,
          children: ({ close }) => {
            return (
              <FinishIssueForm
                issueId={props.issueId}
                status={node.status}
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
          title: node.action ?? `Chuyển ${node.toNode?.name}`,
          children: ({ close }) => {
            return (
              <ForwardIssueForm
                issueId={props.issueId}
                title={`${node.toNode?.name}`}
                status={node.status}
                condition={node.toNode?.condition}
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
    [invalidates, props.issueId]
  );

  return (
    <div className={'flex items-center gap-2 border-b p-2'}>
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
  );
};
