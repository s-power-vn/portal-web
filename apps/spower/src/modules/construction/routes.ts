import { index, route } from '@tanstack/virtual-file-routes';

export const constructionProjectRoutes = [
  route('contract', `../modules/construction/pages/project/contract.tsx`, [
    index(`../modules/construction/pages/project/contract/index.tsx`),
    route('input', `../modules/construction/pages/project/contract/input.tsx`),
    route(
      'monitoring',
      `../modules/construction/pages/project/contract/monitoring.tsx`
    )
  ])
];

export const constructionSettingsRoutes = [
  route(
    'suppliers',
    `../modules/construction/pages/settings/suppliers/list.tsx`,
    [
      route('new', `../modules/construction/pages/settings/suppliers/new.tsx`),
      route(
        '$supplierId/edit',
        `../modules/construction/pages/settings/suppliers/edit.tsx`
      )
    ]
  ),
  route(
    'materials',
    `../modules/construction/pages/settings/materials/list.tsx`,
    [
      route('new', `../modules/construction/pages/settings/materials/new.tsx`),
      route(
        '$materialId/edit',
        `../modules/construction/pages/settings/materials/edit.tsx`
      )
    ]
  )
];
