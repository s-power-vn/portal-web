import { FC } from 'react';

import { Match, RequestStatusOptions, Switch } from '@storeo/core';

export type RequestStatusTextProps = {
  status: string;
};

export const RequestStatusText: FC<RequestStatusTextProps> = props => {
  return (
    <Switch>
      <Match when={props.status === RequestStatusOptions.A1F}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ Người tạo công việc</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>Phó giám đốc ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A1R}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ Phó giám đốc</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>Người tạo công việc ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A2F}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ Phó giám đốc</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>T.Phòng kỹ thuật ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A2R}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ T.Phòng kỹ thuật</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>Phó giám đốc ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A3F}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ T.Phòng kỹ thuật</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>NV.Phòng kỹ thuật ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A3R}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ NV.Phòng kỹ thuật</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>T.Phòng kỹ thuật ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A4F}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ T.Phòng kỹ thuật</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>T.Phòng kế hoạch ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A4R}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ T.Phòng kế hoạch</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>T.Phòng kỹ thuật ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A5F}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ T.Phòng kế hoạch</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>NV.Phòng kế hoạch ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A5R}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ NV.Phòng kế hoạch</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>T.Phòng kế hoạch ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A6F}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ T.Phòng kế hoạch</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>Phó giám đốc ]</span>
        </div>
      </Match>
      <Match when={props.status === RequestStatusOptions.A6R}>
        <div
          className={'text-appBlue flex items-center gap-2 text-xs font-bold'}
        >
          <span>[ Phó giám đốc</span>
          <span className={'text-appError'}>{'->'}</span>
          <span>T.Phòng kế hoạch ]</span>
        </div>
      </Match>
    </Switch>
  );
};
