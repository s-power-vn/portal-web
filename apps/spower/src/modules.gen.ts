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
        display: './modules/construction/objects/request/request-display.tsx',
        newForm:
          './modules/construction/objects/request/form/new-request-form.tsx',
        editForm:
          './modules/construction/objects/request/form/edit-request-form.tsx'
      },
      {
        id: 'Price',
        title: 'Bảng giá',
        description: 'Bảng giá',
        display: './modules/construction/objects/price/price-display.tsx',
        newForm: './modules/construction/objects/price/form/new-price-form.tsx',
        editForm:
          './modules/construction/objects/price/form/edit-price-form.tsx'
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
  return () => import(/* @vite-ignore */ path);
}

export function getObjectNewFormComponent(objectType: string) {
  const path = getObject(objectType).newForm;
  return () => import(/* @vite-ignore */ path);
}

export function getObjectEditFormComponent(objectType: string) {
  const path = getObject(objectType).editForm;
  console.log(path);
  return () => import(/* @vite-ignore */ path);
}

export default modules;
