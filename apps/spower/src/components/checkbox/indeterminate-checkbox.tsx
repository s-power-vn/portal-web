import type { HTMLProps } from 'react';
import { useEffect, useRef } from 'react';

export function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`bg-appWhite border-appGrayDark focus:ring-appBlue cursor-pointer rounded text-blue-600 focus:ring-2`}
      onClick={e => e.stopPropagation()}
      {...rest}
    />
  );
}
