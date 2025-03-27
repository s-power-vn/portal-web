import { CSS, Tailwind } from '@fileforge/react-print';
import { CheckCircle2Icon } from 'lucide-react';
import { DateTime } from 'luxon';
import colors from 'tailwindcss/colors';
import { fontFamily } from 'tailwindcss/defaultTheme';

import type { FC } from 'react';

import { For, Show, formatNumber } from '@minhdtb/storeo-core';

import { ProcessData } from '../flow/types';
import { PriceDetailItem } from './price-display';

export type PriceDocumentProps = {
  project?: string;
  bidding?: string;
  code?: string;
  requester?: string;
  department?: string;
  content?: string;
  data: PriceDetailItem[];
  processData: ProcessData;
  suppliers?: Array<{
    id: string;
    name: string;
  }>;
  approvers?: Array<{
    userId: string;
    userName: string;
    nodeId: string;
    nodeName: string;
  }>;
};

export const PriceDocument: FC<PriceDocumentProps> = props => {
  return (
    <Tailwind
      config={{
        darkMode: ['class'],
        theme: {
          transparent: 'transparent',
          current: 'currentColor',
          container: {
            center: true,
            padding: '2rem',
            screens: {
              '2xl': '1400px'
            }
          },
          extend: {
            colors: {
              border: 'hsl(var(--border))',
              input: 'hsl(var(--input))',
              ring: 'hsl(var(--ring))',
              background: 'hsl(var(--background))',
              foreground: 'hsl(var(--foreground))',
              primary: {
                DEFAULT: '#38598b',
                foreground: '#ffffff'
              },
              secondary: {
                DEFAULT: 'hsl(var(--secondary))',
                foreground: 'hsl(var(--secondary-foreground))'
              },
              destructive: {
                DEFAULT: '#ce3f4b',
                foreground: 'hsl(var(--destructive-foreground))'
              },
              muted: {
                DEFAULT: 'hsl(var(--muted))',
                foreground: 'hsl(var(--muted-foreground))'
              },
              accent: {
                DEFAULT: 'hsl(var(--accent))',
                foreground: 'hsl(var(--accent-foreground))'
              },
              popover: {
                DEFAULT: 'hsl(var(--popover))',
                foreground: 'hsl(var(--popover-foreground))'
              },
              card: {
                DEFAULT: 'hsl(var(--card))',
                foreground: 'hsl(var(--card-foreground))'
              },
              appBlue: '#113f67',
              appBlueLight: '#38598b',
              appBlack: '#101820',
              appWhite: '#ffffff',
              appErrorLight: '#ce3f4b',
              appError: '#CC313D',
              appSuccess: '#6AB187',
              appWarning: '#FFBB00',
              appGrayLight: '#f3f4f6',
              appGray: '#e5e7eb',
              appGrayDark: '#d1d5db',
              tremor: {
                brand: {
                  faint: colors.blue[50],
                  muted: colors.blue[200],
                  subtle: colors.blue[400],
                  DEFAULT: colors.blue[500],
                  emphasis: colors.blue[700],
                  inverted: colors.white
                },
                background: {
                  muted: colors.gray[50],
                  subtle: colors.gray[100],
                  DEFAULT: colors.white,
                  emphasis: colors.gray[700]
                },
                border: {
                  DEFAULT: colors.gray[200]
                },
                ring: {
                  DEFAULT: colors.gray[200]
                },
                content: {
                  subtle: colors.gray[400],
                  DEFAULT: colors.gray[500],
                  emphasis: colors.gray[700],
                  strong: colors.gray[900],
                  inverted: colors.white
                }
              }
            },
            fontFamily: {
              sans: ['var(--font-sans)', ...fontFamily.sans],
              display: 'Inter'
            }
          }
        },
        plugins: []
      }}
    >
      <CSS>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          @page {
            size: a4 landscape;
          }`}
      </CSS>
      <div className="w-full font-[inter] text-sm">
        <div className="flex w-full items-start justify-between">
          <img src={'https://portal.s-power.vn/logo.png'} width={120} />
          <div className={'flex flex-col items-center gap-2'}>
            <div className={'whitespace-nowrap'}>Công ty Cổ phần S-Power</div>
            <span
              className={'text-xs italic'}
            >{`Ngày ${DateTime.now().day} tháng ${DateTime.now().month} năm ${DateTime.now().year}`}</span>
          </div>
        </div>
        <div className={'flex w-full items-center justify-center'}>
          <span className={'text-xl font-bold uppercase'}>Bảng báo giá</span>
        </div>
        <div className={'mt-8 flex w-full flex-col gap-1'}>
          <div className={'flex items-start gap-2'}>
            <div className={'basis-1/4 font-bold'}>Số phiếu</div>
            <div className={'basis-3/4'}>{props.code}</div>
          </div>
          <div className={'flex items-start gap-2'}>
            <div className={'basis-1/4 font-bold'}>Dự án</div>
            <div className={'basis-3/4'}>{props.project}</div>
          </div>
          <div className={'flex items-start gap-2'}>
            <div className={'basis-1/4 font-bold'}>Gói thầu</div>
            <div className={'basis-3/4'}>{props.bidding}</div>
          </div>
          <div className={'flex items-start gap-2'}>
            <div className={'basis-1/4 font-bold'}>Người đề nghị</div>
            <div className={'basis-3/4'}>{props.requester}</div>
          </div>
          <div className={'flex items-start gap-2'}>
            <div className={'basis-1/4 font-bold'}>Bộ phận</div>
            <div className={'basis-3/4'}>{props.department}</div>
          </div>
          <div className={'flex items-start gap-2'}>
            <div className={'basis-1/4 font-bold'}>Nội dung</div>
            <div className={'basis-3/4'}>{props.content}</div>
          </div>
        </div>
        <table className={'mt-8 w-full border'}>
          <thead>
            <tr className={'border-b'}>
              <th rowSpan={2} className={'border-r p-2 text-center'}>
                STT
              </th>
              <th rowSpan={2} className={'border-r p-2 text-center'}>
                ID
              </th>
              <th rowSpan={2} className={'border-r p-2 text-center'}>
                Mô tả công việc mời thầu
              </th>
              <th rowSpan={2} className={'border-r p-2 text-center'}>
                Đơn vị tính
              </th>
              <th rowSpan={2} className={'border-r p-2 text-center'}>
                Khối lượng
              </th>
              <th
                colSpan={1 + (props.suppliers?.length ?? 0)}
                className={'border-r p-2 text-center'}
              >
                Đơn giá
              </th>
              <th
                colSpan={1 + (props.suppliers?.length ?? 0)}
                className={'border-r p-2 text-center'}
              >
                Thành tiền
              </th>
            </tr>
            <tr className={'border-b'}>
              <th className={'border-r p-2 text-center'}>Dự toán</th>
              {props.suppliers?.map(supplier => (
                <th
                  key={`price-${supplier.id}`}
                  className={'border-r p-2 text-center'}
                >
                  {supplier.name}
                </th>
              ))}
              <th className={'border-r p-2 text-center'}>Dự toán</th>
              {props.suppliers?.map(supplier => (
                <th
                  key={`total-${supplier.id}`}
                  className={'border-r p-2 text-center'}
                >
                  {supplier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.data.map((it, index) => (
              <tr
                key={index}
                className={`border-b text-sm ${
                  it.isSubTotal || it.isVAT || it.isFinalTotal
                    ? 'bg-gray-50 font-bold'
                    : ''
                }`}
              >
                <td className={'w-10 border-r p-2 text-center'}>{it.index}</td>
                <td className={'w-10 border-r p-2'}>{it.level}</td>
                <td className={'border-r p-2 text-left'}>{it.title}</td>
                <td className={'w-20 border-r p-2 text-center'}>{it.unit}</td>
                <td className={'w-20 border-r p-2 text-right'}>
                  {formatNumber(it.volume ?? 0)}
                </td>
                <td className={'w-20 border-r p-2 text-right'}>
                  {formatNumber(
                    typeof it.estimatePrice === 'number' ? it.estimatePrice : 0
                  )}
                </td>
                {props.suppliers?.map(supplier => (
                  <td
                    key={`price-${supplier.id}`}
                    className={'w-32 border-r p-2 text-right'}
                  >
                    {formatNumber(it.prices?.[supplier.id] ?? 0)}
                  </td>
                ))}
                <td className={'w-20 border-r p-2 text-right'}>
                  {formatNumber(
                    typeof it.estimateAmount === 'number'
                      ? it.estimateAmount
                      : 0
                  )}
                </td>
                {props.suppliers?.map(supplier => (
                  <td
                    key={`total-${supplier.id}`}
                    className={'w-32 border-r p-2 text-right'}
                  >
                    {formatNumber(it.totals[supplier.id] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={'mt-8 flex items-start justify-between'}>
          <div className={'flex gap-4'}>
            <For
              each={props.processData.nodes.filter(
                node => node.type === 'approval'
              )}
            >
              {node => {
                const approver = props.approvers?.find(
                  a => a.nodeId === node.id
                );
                return (
                  <div key={node.id} className={'flex flex-col items-center'}>
                    <div className={'font-bold'}>{node.name}</div>
                    <div className={'mt-4'}>
                      <Show when={approver}>
                        <CheckCircle2Icon
                          className={'h-10 w-10 text-blue-700'}
                        />
                      </Show>
                    </div>
                    <div className={'mt-[1.5rem] font-bold'}>
                      {approver?.userName ?? ''}
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
          <div className={'flex flex-col items-center'}>
            <div className={'font-bold'}>Người đề nghị</div>
            <div className={'mt-4'}>
              <CheckCircle2Icon className={'h-10 w-10 text-blue-700'} />
            </div>
            <div className={'mt-[1.5rem] font-bold'}>{props.requester}</div>
          </div>
        </div>
      </div>
    </Tailwind>
  );
};
