import { index, route } from '@tanstack/virtual-file-routes';
const modules = [
  {
    "id": "construction",
    "title": "Xây dựng",
    "description": "Xây dựng",
    "objects": [
      {
        "id": "Request",
        "title": "Yêu cầu mua hàng",
        "description": "Yêu cầu mua hàng"
      },
      {
        "id": "Price",
        "title": "Bảng giá",
        "description": "Bảng giá"
      }
    ]
  }
];

export function getProjectRoutes() {
  return [
    route('contract', `../modules/construction/pages/project/contract.tsx`, [
      index(`../modules/construction/pages/project/contract/index.tsx`),
      route('input', `../modules/construction/pages/project/contract/input.tsx`),
      route('monitoring', `../modules/construction/pages/project/contract/monitoring.tsx`)
    ])
  ];
}
  
export function getSettingsRoutes() {
  return [
    route('suppliers', `../modules/construction/pages/settings/suppliers/list.tsx`, [
      route('new', `../modules/construction/pages/settings/suppliers/new.tsx`),
      route('$supplierId/edit', `../modules/construction/pages/settings/suppliers/edit.tsx`)
    ]),
    route('materials', `../modules/construction/pages/settings/materials/list.tsx`, [
      route('new', `../modules/construction/pages/settings/materials/new.tsx`),
      route('$materialId/edit', `../modules/construction/pages/settings/materials/edit.tsx`)
    ])
  ];
}

export function getAllModules() {
  return modules;
}

export function getObjectDisplayComponent(objectType: string) {
  switch (objectType) {
    case 'Request':
      return () => import('./modules/construction/objects/request/request-display');
    case 'Price':
      return () => import('./modules/construction/objects/price/price-display');
    default:
      throw new Error(`Object type ${objectType} not found`);
  }
}

export function getObjectNewFormComponent(objectType: string) {
  switch (objectType) {
    case 'Request':
      return () => import('./modules/construction/objects/request/form/new-request-form');
    case 'Price':
      return () => import('./modules/construction/objects/price/form/new-price-form');
    default:
      throw new Error(`Object type ${objectType} not found`);
  }
}

export function getObjectEditFormComponent(objectType: string) {
  switch (objectType) {
    case 'Request':
      return () => import('./modules/construction/objects/request/form/edit-request-form');
    case 'Price':
      return () => import('./modules/construction/objects/price/form/edit-price-form');
    default:
      throw new Error(`Object type ${objectType} not found`);
  }
}