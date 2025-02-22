import { CSS, Tailwind } from '@fileforge/react-print';
import { CheckCircle2Icon } from 'lucide-react';
import { DateTime } from 'luxon';
import colors from 'tailwindcss/colors';
import { fontFamily } from 'tailwindcss/defaultTheme';

import type { FC } from 'react';

import { For, Show, formatDate } from '@minhdtb/storeo-core';

import { isApproveNode } from '../flow';
import processData from '../flow/process.json';
import { RequestDetailItem } from './request-display';

export type RequestDocumentProps = {
  project?: string;
  bidding?: string;
  code?: string;
  requester?: string;
  department?: string;
  content?: string;
  data: RequestDetailItem[];
  approvers?: Array<{
    userId: string;
    userName: string;
    nodeId: string;
    nodeName: string;
  }>;
};

export const RequestDocument: FC<RequestDocumentProps> = props => {
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
              },
              // dark mode
              'dark-tremor': {
                brand: {
                  faint: '#0B1229',
                  muted: colors.blue[950],
                  subtle: colors.blue[800],
                  DEFAULT: colors.blue[500],
                  emphasis: colors.blue[400],
                  inverted: colors.blue[950]
                },
                background: {
                  muted: '#131A2B',
                  subtle: colors.gray[800],
                  DEFAULT: colors.gray[900],
                  emphasis: colors.gray[300]
                },
                border: {
                  DEFAULT: colors.gray[800]
                },
                ring: {
                  DEFAULT: colors.gray[800]
                },
                content: {
                  subtle: colors.gray[600],
                  DEFAULT: colors.gray[500],
                  emphasis: colors.gray[200],
                  strong: colors.gray[50],
                  inverted: colors.gray[950]
                }
              }
            },
            boxShadow: {
              // light
              'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
              'tremor-card':
                '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              'tremor-dropdown':
                '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              // dark
              'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
              'dark-tremor-card':
                '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              'dark-tremor-dropdown':
                '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            },
            fontSize: {
              'tremor-label': ['0.75rem', { lineHeight: '1rem' }],
              'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
              'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
              'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }]
            },
            borderRadius: {
              lg: `var(--radius)`,
              md: `calc(var(--radius) - 2px)`,
              sm: 'calc(var(--radius) - 4px)',
              'tremor-small': '0.375rem',
              'tremor-default': '0.5rem',
              'tremor-full': '9999px'
            },
            fontFamily: {
              sans: ['var(--font-sans)', ...fontFamily.sans],
              display: 'Inter'
            },
            keyframes: {
              'accordion-down': {
                from: { height: 0 },
                to: { height: 'var(--radix-accordion-content-height)' }
              },
              'accordion-up': {
                from: { height: 'var(--radix-accordion-content-height)' },
                to: { height: 0 }
              }
            },
            animation: {
              'accordion-down': 'accordion-down 0.2s ease-out',
              'accordion-up': 'accordion-up 0.2s ease-out'
            },
            transitionProperty: {
              width: 'width',
              dropdown: 'padding, opacity',
              visible: 'visibility'
            },
            transitionDuration: {
              default: '300ms'
            }
          }
        },
        safelist: [
          {
            pattern:
              /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected']
          },
          {
            pattern:
              /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected']
          },
          {
            pattern:
              /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected']
          },
          {
            pattern:
              /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
          },
          {
            pattern:
              /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
          },
          {
            pattern:
              /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
          }
        ],
        plugins: []
      }}
    >
      <CSS>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          @page {
            size: a4;
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
          <span className={'text-xl font-bold uppercase'}>
            Phiếu đề nghị mua hàng
          </span>
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
              <th className={'border-r p-2'}>STT</th>
              <th className={' border-r p-2'}>ID</th>
              <th className={'border-r p-2'}>Mô tả công việc mời thầu</th>
              <th className={'border-r p-2'}>Đơn vị tính</th>
              <th className={'border-r p-2'}>Khối lượng</th>
              <th className={'border-r p-2'}>Ngày cấp</th>
              <th className={'p-2'}>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((it, index) => (
              <tr key={index} className={'border-b text-sm'}>
                <td className={'w-10 border-r p-2 text-center'}>{it.index}</td>
                <td className={'w-10 border-r p-2'}>{it.level}</td>
                <td className={'border-r p-2 text-left'}>{it.title}</td>
                <td className={'w-20 border-r p-2 text-center'}>{it.unit}</td>
                <td className={'w-20 border-r p-2 text-center'}>
                  {it.requestVolume}
                </td>
                <td className={'w-20 border-r p-2 text-right'}>
                  {formatDate(it.deliveryDate ?? '')}
                </td>
                <td className={'w-40 p-2'}>{it.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={'mt-8 flex items-start justify-between'}>
          <div className={'flex gap-4'}>
            <For
              each={processData.request.nodes.filter(node =>
                isApproveNode('request', node.id)
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
