import { FC } from 'react';

import { cn } from '@minhdtb/storeo-core';

export type SkeletonProps = {
  className?: string;
};

export const Skeleton: FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn('animate-pulse rounded-md bg-gray-200', className)} />
  );
};
