import { type ClassValue, clsx } from 'clsx';
import { withExtendedShadows } from 'tailwind-extended-shadows-merge';
import { extendTailwindMerge } from 'tailwind-merge';

export const twMerge = extendTailwindMerge(withExtendedShadows);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return value
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    : '';
}

export function formatNumber(value: number) {
  return value ? new Intl.NumberFormat('vi-VN', {}).format(value) : '';
}
