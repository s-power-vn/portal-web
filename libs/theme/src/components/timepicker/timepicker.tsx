import * as _ from 'lodash';
import { DateTime } from 'luxon';

import { FC, useEffect, useState } from 'react';

import { cn } from '@storeo/core';

import { SelectInput } from '../input';

const hours = _.range(0, 24, 1).map(v => ({
  label: v.toString(),
  value: v.toString()
}));

const minutes = _.range(0, 60, 1).map(v => ({
  label: v.toString(),
  value: v.toString()
}));

export type TimepickerProps = {
  value?: DateTime;
  onChange?: (value: DateTime | undefined) => void;
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
        <SelectInput
          value={hour?.toString()}
          placeholder={'Giờ'}
          className={'w-full'}
          items={hours}
          onChange={v => {
            if (v) {
              setHour(parseInt(v));
              props.onChange?.(props.value?.set({ hour: parseInt(v), minute }));
            }
          }}
        />
      </div>
      <div className={'flex-1'}>
        <SelectInput
          value={minute?.toString()}
          placeholder={'Phút'}
          className={'w-full'}
          items={minutes}
          onChange={v => {
            if (v) {
              setMinute(parseInt(v));
              props.onChange?.(props.value?.set({ hour, minute: parseInt(v) }));
            }
          }}
        />
      </div>
    </div>
  );
};
