const modules = [
  {
    id: 'construction',
    title: 'Xây dựng',
    description: 'Xây dựng',
    objects: [
      {
        id: 'Request',
        title: 'Yêu cầu mua hàng',
        description: 'Yêu cầu mua hàng'
      },
      {
        id: 'Price',
        title: 'Bảng giá',
        description: 'Bảng giá'
      }
    ]
  }
];

export function getAllModules() {
  return modules;
}

export function getObjectDisplayComponent(objectType: string) {
  switch (objectType) {
    case 'Request':
      return () =>
        import('./modules/construction/objects/request/request-display');
    case 'Price':
      return () => import('./modules/construction/objects/price/price-display');
    default:
      throw new Error(`Object type ${objectType} not found`);
  }
}

export function getObjectNewFormComponent(objectType: string) {
  switch (objectType) {
    case 'Request':
      return () =>
        import('./modules/construction/objects/request/form/new-request-form');
    case 'Price':
      return () =>
        import('./modules/construction/objects/price/form/new-price-form');
    default:
      throw new Error(`Object type ${objectType} not found`);
  }
}

export function getObjectEditFormComponent(objectType: string) {
  switch (objectType) {
    case 'Request':
      return () =>
        import('./modules/construction/objects/request/form/edit-request-form');
    case 'Price':
      return () =>
        import('./modules/construction/objects/price/form/edit-price-form');
    default:
      throw new Error(`Object type ${objectType} not found`);
  }
}
