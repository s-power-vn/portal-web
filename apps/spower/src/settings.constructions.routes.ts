import { route } from '@tanstack/virtual-file-routes';

export const settingsConstructionsRoutes = [
  route('customers', './private/settings/general/customers/list.tsx', [
    route('new', './private/settings/general/customers/new.tsx'),
    route('$customerId/edit', './private/settings/general/customers/edit.tsx')
  ]),
  route('suppliers', './private/settings/general/suppliers/list.tsx', [
    route('new', './private/settings/general/suppliers/new.tsx'),
    route('$supplierId/edit', './private/settings/general/suppliers/edit.tsx')
  ]),
  route('materials', './private/settings/general/materials/list.tsx', [
    route('new', './private/settings/general/materials/new.tsx'),
    route('$materialId/edit', './private/settings/general/materials/edit.tsx')
  ])
];
