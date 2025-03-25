/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import { DateTime } from 'luxon';
import { withExtendedShadows } from 'tailwind-extended-shadows-merge';
import { extendTailwindMerge } from 'tailwind-merge';

import type { TemplateRecord } from './client';
import { Collections, client } from './client';

export const twMerge = extendTailwindMerge(withExtendedShadows);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return value
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        currencyDisplay: 'code'
      })
        .format(value)
        .replace('VND', '')
    : '';
}

export function formatNumber(value: number) {
  return value ? new Intl.NumberFormat('vi-VN', {}).format(value) : '';
}

export function formatDateTime(value: string) {
  return value
    ? DateTime.fromJSDate(new Date(Date.parse(value))).toFormat(
        'HH:mm dd/MM/yyyy'
      )
    : '';
}

export function formatDate(value: string) {
  return value
    ? DateTime.fromJSDate(new Date(Date.parse(value))).toFormat('dd/MM/yyyy')
    : '';
}

export async function downloadTemplate(
  fileName: keyof TemplateRecord,
  contentType?: string
) {
  const record = await client
    .collection(Collections.Template)
    .getFirstListItem('');
  const url = client.files.getURL(record, record[fileName]);
  fetch(url, {
    method: 'GET',
    headers: contentType
      ? {
          'Content-Type': contentType
        }
      : undefined
  })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `template.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    });
}

export function maskVolumeString(value: string) {
  const index = value.indexOf(',');
  if (index === -1) {
    return value;
  }

  const remainLength = value.length - index - 1;
  if (remainLength > 2) {
    return value.slice(0, index + 3);
  }

  return value;
}
