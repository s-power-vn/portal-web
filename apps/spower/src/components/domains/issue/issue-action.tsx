/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'portal-api';

import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

import { For, Show } from '@minhdtb/storeo-core';
import { Button, showModal } from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';
import processData from '../../../process.json';
import { extractStatus } from '../../flow/process-flow';
import { ForwardIssueForm } from './forward-issue-form';
import { ReturnIssueForm } from './return-issue-form';

export type IssueActionProps = {
  issueId: string;
};

export const IssueAction: FC<IssueActionProps> = props => {
  const invalidates = useInvalidateQueries();

  const issue = api.issue.byId.useSuspenseQuery({
    variables: props.issueId
  });

  const currentNode = useMemo(() => {
    return processData.request.nodes.find(it => {
      const extracted = extractStatus(issue.data.status);
      const currentNode = extracted?.to ? extracted.to : extracted?.from;
      return it.id === currentNode;
    });
  }, [issue.data.status]);

  const toList = useMemo(() => {
    return processData.request.flows
      .filter(it => it.from.node === currentNode?.id)
      .map(it => {
        const nodeInfo = processData.request.nodes.find(
          node => node.id === it.to.node
        );

        return {
          ...extractStatus(it.id),
          status: it.id,
          action: it.action,
          toNode: nodeInfo,
          condition: it.condition
        };
      });
  }, [currentNode?.id]);

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
    (node: any) => {
      if (!node) {
        return;
      }

      showModal({
        title: node.action ?? `Chuyển ${node.toNode?.name}`,
        children: ({ close }) => {
          return (
            <ForwardIssueForm
              issueId={props.issueId}
              title={`${node.toNode?.name}`}
              status={node.status}
              condition={node.condition}
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
    },
    [invalidates, props.issueId]
  );

  return (
    <div className={'flex items-center gap-2 border-b p-2'}>
      <Show when={returnNode}>
        <Button onClick={returnNodeClick}>
          {returnNode?.action ?? 'Chuyển trả'}
        </Button>
      </Show>
      <For each={forwardNodes}>
        {item => {
          return (
            <Button
              key={item.toNode?.id}
              onClick={() => forwardNodeClick(item)}
            >
              {item.action ?? `Chuyển ${item.toNode?.name}`}
            </Button>
          );
        }}
      </For>
    </div>
  );
};
