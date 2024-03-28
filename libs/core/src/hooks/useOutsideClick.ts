/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';

export function useOutsideClick(onClickOut: () => void, deps = []) {
  const ref = useRef<any>();

  useEffect(() => {
    const onClick = ({ target }: any) =>
      !ref?.current.contains(target) && onClickOut?.();
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, deps);

  return ref;
}
