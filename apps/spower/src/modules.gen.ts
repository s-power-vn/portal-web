const modules = [
  {
    id: 'construction',
    title: 'Xây dựng',
    description: 'Xây dựng',
    objects: [
      {
        id: 'Request',
        title: 'Yêu cầu mua hàng',
        description: 'Yêu cầu mua hàng',
        display: './modules/construction/objects/request/request-display',
        newForm: './modules/construction/objects/request/form/new-request-form',
        editForm:
          './modules/construction/objects/request/form/edit-request-form'
      },
      {
        id: 'Price',
        title: 'Bảng giá',
        description: 'Bảng giá',
        display: './modules/construction/objects/price/price-display',
        newForm: './modules/construction/objects/price/form/new-price-form',
        editForm: './modules/construction/objects/price/form/edit-price-form'
      }
    ]
  }
];

export function getAllModules() {
  return modules;
}

export function getObject(objectType: string) {
  const object = modules
    .flatMap(m => m.objects)
    .find(obj => obj.id === objectType);
  if (!object) {
    throw new Error(`Object type ${objectType} not found`);
  }
  return object;
}

export function getObjectDisplayComponent(objectType: string) {
  const path = getObject(objectType).display;
  return () =>
    import(
      /* @vite-ignore */ process.env.NODE_ENV === 'development'
        ? `/src/${path}`
        : `./${path}`
    );
}

export function getObjectNewFormComponent(objectType: string) {
  const path = getObject(objectType).newForm;
  return () =>
    import(
      /* @vite-ignore */ process.env.NODE_ENV === 'development'
        ? `/src/${path}`
        : `./${path}`
    );
}

export function getObjectEditFormComponent(objectType: string) {
  const path = getObject(objectType).editForm;
  return () =>
    import(
      /* @vite-ignore */ process.env.NODE_ENV === 'development'
        ? `/src/${path}`
        : `./${path}`
    );
}

export default modules;
