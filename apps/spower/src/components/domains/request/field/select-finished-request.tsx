import { FC } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type SelectFinishedRequestProps = Partial<ComboboxProps>;

export const SelectFinishedRequest: FC<SelectFinishedRequestProps> = props => {
  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn yêu cầu mua hàng'}
      emptyText={props.emptyText ?? 'Không tìm thấy yêu cầu mua hàng'}
      queryKey={['request-finished']}
      queryFn={async ({ search, page }) => {
        return {
          items: [],
          hasMore: false
        };
      }}
    />
  );
};
