/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import { round } from 'lodash';
import { DateTime } from 'luxon';
import { withExtendedShadows } from 'tailwind-extended-shadows-merge';
import { extendTailwindMerge } from 'tailwind-merge';

import { client } from './client';
import { Collections, TemplateRecord } from './generate/pb';

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

export function formatDate(value: string) {
  return value
    ? DateTime.fromJSDate(new Date(Date.parse(value))).toFormat(
        'HH:mm dd/MM/yyyy'
      )
    : '';
}

export function timeSince(timeStamp: Date | number): string | undefined {
  if (!(timeStamp instanceof Date)) {
    timeStamp = new Date(timeStamp);
  }

  if (isNaN(timeStamp.getDate())) {
    return 'Invalid date';
  }

  const now = new Date(),
    secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;

  const formatDate = function (date: Date, format: string, utc = false) {
    const MMMM = [
      '\x00',
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ];
    const MMM = [
      '\x01',
      'Th 1',
      'Th 2',
      'Th 3',
      'Th 4',
      'Th 5',
      'Th 6',
      'Th 7',
      'Th 8',
      'Th 9',
      'Th 10',
      'Th 11',
      'Th 12'
    ];
    const dddd = [
      '\x02',
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy'
    ];
    const ddd = ['\x03', 'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    function ii(i: string | number, len = 0) {
      let s = i + '';
      len = len || 2;
      while (s.length < len) s = '0' + s;
      return s;
    }

    const y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, '$1' + y);
    format = format.replace(/(^|[^\\])yy/g, '$1' + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, '$1' + y);

    const M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, '$1' + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, '$1' + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, '$1' + ii(M));
    format = format.replace(/(^|[^\\])M/g, '$1' + M);

    const d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, '$1' + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, '$1' + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, '$1' + ii(d));
    format = format.replace(/(^|[^\\])d/g, '$1' + d);

    const H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, '$1' + ii(H));
    format = format.replace(/(^|[^\\])H/g, '$1' + H);

    const h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, '$1' + ii(h));
    format = format.replace(/(^|[^\\])h/g, '$1' + h);

    const m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, '$1' + ii(m));
    format = format.replace(/(^|[^\\])m/g, '$1' + m);

    const s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, '$1' + ii(s));
    format = format.replace(/(^|[^\\])s/g, '$1' + s);

    let f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, '$1' + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, '$1' + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, '$1' + f);

    const T = H < 12 ? 'AM' : 'PM';
    format = format.replace(/(^|[^\\])TT+/g, '$1' + T);
    format = format.replace(/(^|[^\\])T/g, '$1' + T.charAt(0));

    const t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, '$1' + t);
    format = format.replace(/(^|[^\\])t/g, '$1' + t.charAt(0));

    let tz = -date.getTimezoneOffset();
    let K = utc || !tz ? 'Z' : tz > 0 ? '+' : '-';
    if (!utc) {
      tz = Math.abs(tz);
      const tzHrs = Math.floor(tz / 60);
      const tzMin = tz % 60;
      K += ii(tzHrs) + ':' + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, '$1' + K);

    const day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], 'g'), dddd[day]);
    format = format.replace(new RegExp(ddd[0], 'g'), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], 'g'), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], 'g'), MMM[M]);

    format = format.replace(/\\(.)/g, '$1');

    return format;
  };

  if (secondsPast < 0) {
    // Future date
    return timeStamp.toLocaleTimeString();
  }
  if (secondsPast < 60) {
    // Less than a minute
    return round(secondsPast) + ' giây trước';
  }
  if (secondsPast < 3600) {
    // Less than an hour
    return round(secondsPast / 60) + ' phút trước';
  }
  if (secondsPast <= 86400) {
    // Less than a day
    return round(secondsPast / 3600) + ' giờ trước';
  }
  if (secondsPast <= 172800) {
    // Less than 2 days
    return 'Hôm qua lúc ' + formatDate(timeStamp, 'h:mmtt');
  }
  if (secondsPast > 172800) {
    // After two days
    let timeString;

    if (secondsPast <= 604800)
      timeString =
        formatDate(timeStamp, 'dddd') +
        ' lúc ' +
        formatDate(timeStamp, 'h:mmtt');
    // with in a week
    else if (now.getFullYear() > timeStamp.getFullYear())
      timeString = formatDate(timeStamp, 'd MMMM, yyyy'); // a year ago
    else if (now.getMonth() > timeStamp.getMonth())
      timeString = formatDate(timeStamp, 'd MMMM'); // months ago
    else
      timeString =
        formatDate(timeStamp, 'MMMM d') +
        ' lúc ' +
        formatDate(timeStamp, 'h:mmtt'); // with in a month

    return timeString;
  }

  return undefined;
}

export async function downloadTemplate(
  fileName: keyof TemplateRecord,
  contentType?: string
) {
  const record = await client
    .collection(Collections.Template)
    .getFirstListItem('');
  const url = client.files.getUrl(record, record[fileName]);
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
