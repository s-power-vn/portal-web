import { useRouter } from '@tanstack/react-router';
import {
  CopyIcon,
  Edit3,
  LinkIcon,
  Loader,
  MoreHorizontalIcon,
  RefreshCw,
  Trash2,
  Undo2Icon
} from 'lucide-react';
import { api } from 'portal-api';
import { userId } from 'portal-core';

import type { FC } from 'react';
import { Suspense, lazy, useCallback, useMemo } from 'react';

import { Show, formatDateTime } from '@minhdtb/storeo-core';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeButton,
  showModal,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';
import { getObjectEditFormComponent } from '../../../modules.gen';
import { DynamicIcon } from '../../icon/dynamic-icon';
import { EmployeeDisplay } from '../employee';
import { ProcessData, extractStatus, getNode } from '../flow';
import { IssueAssigneeDisplay } from './issue-assignee-display';
import { IssueDeadlineStatus } from './issue-deadline-status';
import { IssueStatus } from './issue-status';

type DynamicObjectEditFormProps = {
  objectType: string;
  issueId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const DynamicObjectEditForm: FC<DynamicObjectEditFormProps> = ({
  objectType,
  issueId,
  onSuccess,
  onCancel
}) => {
  const Component = lazy(getObjectEditFormComponent(objectType));
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <Component issueId={issueId} onSuccess={onSuccess} onCancel={onCancel} />
    </Suspense>
  );
};

export type IssueSummaryProps = {
  issueId: string;
};

const ObjectTypeIcon = ({ objectType }: { objectType?: any }) => {
  if (!objectType) return null;

  return (
    <DynamicIcon
      svgContent={objectType.icon}
      className={'h-4 w-4'}
      style={{ color: objectType.color || '#6b7280' }}
    />
  );
};

const SummaryComponent: FC<IssueSummaryProps> = props => {
  const { issueId } = props;
  const router = useRouter();
  const invalidates = useInvalidateQueries();
  const { confirm } = useConfirm();

  const { data: user } = api.user.byId.useSuspenseQuery({
    variables: userId.value
  });

  const { data: issue } = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const issueObject = issue?.object;

  const process = issueObject?.process;

  const statusInfo = extractStatus(issue?.status);

  const toNode = useMemo(() => {
    return getNode(process?.process as ProcessData, statusInfo?.to);
  }, [process, statusInfo]);

  const isInDoneState = toNode?.type === 'finish';

  const deleteIssue = api.issue.delete.useMutation({
    onSuccess: () => {
      invalidates([
        api.issue.listByObjectType.getKey(),
        api.issue.listMine.getKey()
      ]);

      router.history.back();
    }
  });

  const resetIssue = api.issue.reset.useMutation({
    onSuccess: () => {
      invalidates([
        api.issue.listByObjectType.getKey(),
        api.issue.listMine.getKey()
      ]);

      router.history.back();
    }
  });

  const handleEditIssue = useCallback(() => {
    showModal({
      title: 'Chỉnh sửa công việc',
      className: 'flex min-w-[1000px] flex-col',
      description: 'Chỉnh sửa thông tin công việc',
      children: ({ close }) => {
        return (
          <DynamicObjectEditForm
            objectType={issueObject?.objectType?.name ?? ''}
            issueId={issueId}
            onSuccess={() => {
              invalidates([
                api.issue.byId.getKey(issueId),
                api.price.byIssueId.getKey(issueId)
              ]);
              close();
            }}
            onCancel={close}
          />
        );
      }
    });
  }, [invalidates, issueId]);

  const handleResetIssue = useCallback(() => {
    confirm('Bạn chắc chắn muốn đặt trạng thái công việc này?', () => {
      resetIssue.mutate({ id: issueId });
    });
  }, [confirm, issueId, resetIssue]);

  const handleDeleteIssue = useCallback(() => {
    confirm('Bạn chắc chắn muốn xóa công việc này?', () => {
      deleteIssue.mutate(issueId);
    });
  }, [confirm, deleteIssue, issueId]);

  const handleCopyTitle = useCallback(() => {
    navigator.clipboard.writeText(issue?.title || '').then(() => {
      success('Đã sao chép tiêu đề');
    });
  }, [issue?.title]);

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      success('Đã sao chép đường dẫn');
    });
  }, []);

  return (
    <div className={'flex flex-col gap-2 border-b p-2'}>
      <div className={'flex items-center gap-2'}>
        <Button
          className={'h-6 w-10'}
          size={'icon'}
          onClick={() => router.history.back()}
        >
          <Undo2Icon className={'h-4 w-4'} />
        </Button>
        <span className={'flex flex-1 items-center gap-1 text-base font-bold'}>
          <ObjectTypeIcon objectType={issueObject?.objectType} />
          {issue?.title}
        </span>
        <ThemeButton
          variant={'outline'}
          className={'h-6 w-6'}
          size={'icon'}
          onClick={handleCopyTitle}
          title="Sao chép tiêu đề"
        >
          <CopyIcon className={'h-4 w-4'} />
        </ThemeButton>
        <ThemeButton
          variant={'outline'}
          className={'h-6 w-6'}
          size={'icon'}
          onClick={handleCopyUrl}
          title="Sao chép đường dẫn"
        >
          <LinkIcon className={'h-4 w-4'} />
        </ThemeButton>
        <Show
          when={issue?.assignees?.some(a => a === user?.id) && !isInDoneState}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ThemeButton
                variant={'outline'}
                className={'h-6 w-6'}
                size={'icon'}
                onClick={() => router.history.back()}
              >
                <MoreHorizontalIcon className={'h-4 w-4'} />
              </ThemeButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={handleEditIssue}>
                <Edit3 className="mr-2 h-4 w-4 text-red-500" />
                Sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleResetIssue}>
                <RefreshCw className="mr-2 h-4 w-4 text-blue-500" />
                Đặt lại trạng thái
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteIssue}>
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Show>
      </div>
      <div className={'mr-2 flex w-full gap-6'}>
        <div className={'flex flex-1 flex-col items-center gap-2 text-sm'}>
          <div className={'flex h-6 w-full items-center justify-between gap-2'}>
            <span className={'text-appBlue whitespace-nowrap text-xs'}>
              Ngày tạo
            </span>
            <span className={'truncate'}>
              {issue?.created ? formatDateTime(issue.created) : ''}
            </span>
          </div>
          <div className={'flex h-6 w-full items-center justify-between gap-2'}>
            <span className={'text-appBlue whitespace-nowrap text-xs'}>
              Ngày tạo
            </span>
            <span className={'truncate'}>
              {issue?.created ? formatDateTime(issue.created) : ''}
            </span>
          </div>
          <div className={'flex h-6 w-full items-center justify-between gap-2'}>
            <span className={'text-appBlue whitespace-nowrap text-xs'}>
              Số phiếu
            </span>
            <span className={'truncate'}>{issue?.code}</span>
          </div>
        </div>
        <div className={'flex flex-1 flex-col items-center gap-2 text-sm'}>
          <div className={'flex h-6 w-full items-center justify-between gap-2'}>
            <span className={'text-appBlue whitespace-nowrap text-xs'}>
              Người tạo
            </span>
            <span className={'truncate'}>
              <EmployeeDisplay employeeId={issue?.createdBy?.id} />
            </span>
          </div>
          <div className={'flex h-6 w-full items-center justify-between gap-2'}>
            <span className={'text-appBlue whitespace-nowrap text-xs'}>
              Người xử lý
            </span>
            <div className="flex justify-end">
              <IssueAssigneeDisplay issueId={issueId} maxVisible={1} />
            </div>
          </div>
        </div>
        <div className={'flex flex-1 flex-col items-center gap-2 text-sm'}>
          <div className={'flex h-6 w-full items-center justify-between gap-2'}>
            <span className={'text-appBlue whitespace-nowrap text-xs'}>
              Ngày bắt đầu
            </span>
            <span className={'truncate'}>
              {issue?.startDate ? formatDateTime(issue.startDate) : ''}
            </span>
          </div>
          <div className={'flex h-6 w-full items-center justify-between gap-2'}>
            <span className={'text-appBlue whitespace-nowrap text-xs'}>
              Ngày kết thúc
            </span>
            <span className={'truncate'}>
              {issue?.endDate ? formatDateTime(issue.endDate) : ''}
            </span>
          </div>
        </div>
      </div>
      <div className={'flex h-6 w-full justify-end gap-2'}>
        <IssueDeadlineStatus className={'font-bold'} issueId={issueId} />
        <IssueStatus
          className={'px-3 py-1.5 text-xs font-bold'}
          issueId={issueId}
        />
      </div>
    </div>
  );
};

export const IssueSummary: FC<IssueSummaryProps> = props => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-2">
          <Loader className={'h-4 w-4 animate-spin'} />
        </div>
      }
    >
      <SummaryComponent {...props} />
    </Suspense>
  );
};
