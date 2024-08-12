/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateTime } from 'luxon';

import { FC, useEffect, useState } from 'react';

import { cn } from '@storeo/core';

import { MaskedInput } from '../input';

export type TimepickerProps = {
  value?: DateTime | null;
  onChange?: (value: DateTime | undefined | null) => void;
  className?: string;
};

export const Timepicker: FC<TimepickerProps> = props => {
  const [hour, setHour] = useState<number | undefined>(props.value?.hour);
  const [minute, setMinute] = useState<number | undefined>(props.value?.minute);

  useEffect(() => {
    if (props.value) {
      setHour(props.value.hour);
      setMinute(props.value.minute);
    } else {
      setHour(undefined);
      setMinute(undefined);
    }
  }, [props.value]);

  return (
    <div className={cn('flex w-44 gap-2', props.className)}>
      <div className={'flex-1'}>
        <MaskedInput
          value={hour?.toString()}
          onChange={(v: any) => {
            if (v.target.value) {
              setHour(parseInt(v.target.value));
              props.onChange?.(
                props.value?.set({ hour: parseInt(v.target.value), minute })
              );
            }
          }}
          mask={Number}
          min={0}
          max={23}
          autofix={true}
        />
      </div>
      <div className={'flex-1'}>
        <MaskedInput
          value={minute?.toString()}
          onChange={(v: any) => {
            if (v.target.value) {
              setMinute(parseInt(v.target.value));
              props.onChange?.(
                props.value?.set({ minute: parseInt(v.target.value), hour })
              );
            }
          }}
          mask={Number}
          min={0}
          max={59}
          autofix={true}
        />
      </div>
    </div>
  );
};
