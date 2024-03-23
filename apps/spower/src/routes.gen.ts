/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as IndexImport } from './routes/index'
import { Route as AuthenticatedHomeImport } from './routes/_authenticated/home'
import { Route as AuthenticatedGeneralImport } from './routes/_authenticated/general'
import { Route as AuthenticatedGeneralIndexImport } from './routes/_authenticated/general/index'
import { Route as AuthenticatedGeneralSuppliersImport } from './routes/_authenticated/general/suppliers'
import { Route as AuthenticatedGeneralEmployeesImport } from './routes/_authenticated/general/employees'
import { Route as AuthenticatedGeneralCustomersImport } from './routes/_authenticated/general/customers'
import { Route as AuthenticatedDocumentWaitingImport } from './routes/_authenticated/document/waiting'
import { Route as AuthenticatedDocumentMineImport } from './routes/_authenticated/document/mine'
import { Route as AuthenticatedDocumentAllImport } from './routes/_authenticated/document/all'
import { Route as AuthenticatedDocumentWaitingIndexImport } from './routes/_authenticated/document/waiting/index'
import { Route as AuthenticatedDocumentMineIndexImport } from './routes/_authenticated/document/mine/index'
import { Route as AuthenticatedDocumentAllIndexImport } from './routes/_authenticated/document/all/index'
import { Route as AuthenticatedGeneralSuppliersNewImport } from './routes/_authenticated/general/suppliers/new'
import { Route as AuthenticatedGeneralEmployeesNewImport } from './routes/_authenticated/general/employees/new'
import { Route as AuthenticatedGeneralCustomersNewImport } from './routes/_authenticated/general/customers/new'
import { Route as AuthenticatedGeneralSuppliersSupplierIdEditImport } from './routes/_authenticated/general/suppliers/$supplierId/edit'
import { Route as AuthenticatedGeneralEmployeesEmployeeIdEditImport } from './routes/_authenticated/general/employees/$employeeId/edit'
import { Route as AuthenticatedGeneralCustomersCustomerIdEditImport } from './routes/_authenticated/general/customers/$customerId/edit'
import { Route as AuthenticatedDocumentWaitingDocumentIdEditImport } from './routes/_authenticated/document/waiting/$documentId/edit'
import { Route as AuthenticatedDocumentMineDocumentIdEditImport } from './routes/_authenticated/document/mine/$documentId/edit'
import { Route as AuthenticatedDocumentAllDocumentIdEditImport } from './routes/_authenticated/document/all/$documentId/edit'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedHomeRoute = AuthenticatedHomeImport.update({
  path: '/home',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedGeneralRoute = AuthenticatedGeneralImport.update({
  path: '/general',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedGeneralIndexRoute = AuthenticatedGeneralIndexImport.update({
  path: '/',
  getParentRoute: () => AuthenticatedGeneralRoute,
} as any)

const AuthenticatedGeneralSuppliersRoute =
  AuthenticatedGeneralSuppliersImport.update({
    path: '/suppliers',
    getParentRoute: () => AuthenticatedGeneralRoute,
  } as any)

const AuthenticatedGeneralEmployeesRoute =
  AuthenticatedGeneralEmployeesImport.update({
    path: '/employees',
    getParentRoute: () => AuthenticatedGeneralRoute,
  } as any)

const AuthenticatedGeneralCustomersRoute =
  AuthenticatedGeneralCustomersImport.update({
    path: '/customers',
    getParentRoute: () => AuthenticatedGeneralRoute,
  } as any)

const AuthenticatedDocumentWaitingRoute =
  AuthenticatedDocumentWaitingImport.update({
    path: '/document/waiting',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedDocumentMineRoute = AuthenticatedDocumentMineImport.update({
  path: '/document/mine',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedDocumentAllRoute = AuthenticatedDocumentAllImport.update({
  path: '/document/all',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedDocumentWaitingIndexRoute =
  AuthenticatedDocumentWaitingIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedDocumentWaitingRoute,
  } as any)

const AuthenticatedDocumentMineIndexRoute =
  AuthenticatedDocumentMineIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedDocumentMineRoute,
  } as any)

const AuthenticatedDocumentAllIndexRoute =
  AuthenticatedDocumentAllIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedDocumentAllRoute,
  } as any)

const AuthenticatedGeneralSuppliersNewRoute =
  AuthenticatedGeneralSuppliersNewImport.update({
    path: '/new',
    getParentRoute: () => AuthenticatedGeneralSuppliersRoute,
  } as any)

const AuthenticatedGeneralEmployeesNewRoute =
  AuthenticatedGeneralEmployeesNewImport.update({
    path: '/new',
    getParentRoute: () => AuthenticatedGeneralEmployeesRoute,
  } as any)

const AuthenticatedGeneralCustomersNewRoute =
  AuthenticatedGeneralCustomersNewImport.update({
    path: '/new',
    getParentRoute: () => AuthenticatedGeneralCustomersRoute,
  } as any)

const AuthenticatedGeneralSuppliersSupplierIdEditRoute =
  AuthenticatedGeneralSuppliersSupplierIdEditImport.update({
    path: '/$supplierId/edit',
    getParentRoute: () => AuthenticatedGeneralSuppliersRoute,
  } as any)

const AuthenticatedGeneralEmployeesEmployeeIdEditRoute =
  AuthenticatedGeneralEmployeesEmployeeIdEditImport.update({
    path: '/$employeeId/edit',
    getParentRoute: () => AuthenticatedGeneralEmployeesRoute,
  } as any)

const AuthenticatedGeneralCustomersCustomerIdEditRoute =
  AuthenticatedGeneralCustomersCustomerIdEditImport.update({
    path: '/$customerId/edit',
    getParentRoute: () => AuthenticatedGeneralCustomersRoute,
  } as any)

const AuthenticatedDocumentWaitingDocumentIdEditRoute =
  AuthenticatedDocumentWaitingDocumentIdEditImport.update({
    path: '/$documentId/edit',
    getParentRoute: () => AuthenticatedDocumentWaitingRoute,
  } as any)

const AuthenticatedDocumentMineDocumentIdEditRoute =
  AuthenticatedDocumentMineDocumentIdEditImport.update({
    path: '/$documentId/edit',
    getParentRoute: () => AuthenticatedDocumentMineRoute,
  } as any)

const AuthenticatedDocumentAllDocumentIdEditRoute =
  AuthenticatedDocumentAllDocumentIdEditImport.update({
    path: '/$documentId/edit',
    getParentRoute: () => AuthenticatedDocumentAllRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/general': {
      preLoaderRoute: typeof AuthenticatedGeneralImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/home': {
      preLoaderRoute: typeof AuthenticatedHomeImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/document/all': {
      preLoaderRoute: typeof AuthenticatedDocumentAllImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/document/mine': {
      preLoaderRoute: typeof AuthenticatedDocumentMineImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/document/waiting': {
      preLoaderRoute: typeof AuthenticatedDocumentWaitingImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/general/customers': {
      preLoaderRoute: typeof AuthenticatedGeneralCustomersImport
      parentRoute: typeof AuthenticatedGeneralImport
    }
    '/_authenticated/general/employees': {
      preLoaderRoute: typeof AuthenticatedGeneralEmployeesImport
      parentRoute: typeof AuthenticatedGeneralImport
    }
    '/_authenticated/general/suppliers': {
      preLoaderRoute: typeof AuthenticatedGeneralSuppliersImport
      parentRoute: typeof AuthenticatedGeneralImport
    }
    '/_authenticated/general/': {
      preLoaderRoute: typeof AuthenticatedGeneralIndexImport
      parentRoute: typeof AuthenticatedGeneralImport
    }
    '/_authenticated/general/customers/new': {
      preLoaderRoute: typeof AuthenticatedGeneralCustomersNewImport
      parentRoute: typeof AuthenticatedGeneralCustomersImport
    }
    '/_authenticated/general/employees/new': {
      preLoaderRoute: typeof AuthenticatedGeneralEmployeesNewImport
      parentRoute: typeof AuthenticatedGeneralEmployeesImport
    }
    '/_authenticated/general/suppliers/new': {
      preLoaderRoute: typeof AuthenticatedGeneralSuppliersNewImport
      parentRoute: typeof AuthenticatedGeneralSuppliersImport
    }
    '/_authenticated/document/all/': {
      preLoaderRoute: typeof AuthenticatedDocumentAllIndexImport
      parentRoute: typeof AuthenticatedDocumentAllImport
    }
    '/_authenticated/document/mine/': {
      preLoaderRoute: typeof AuthenticatedDocumentMineIndexImport
      parentRoute: typeof AuthenticatedDocumentMineImport
    }
    '/_authenticated/document/waiting/': {
      preLoaderRoute: typeof AuthenticatedDocumentWaitingIndexImport
      parentRoute: typeof AuthenticatedDocumentWaitingImport
    }
    '/_authenticated/document/all/$documentId/edit': {
      preLoaderRoute: typeof AuthenticatedDocumentAllDocumentIdEditImport
      parentRoute: typeof AuthenticatedDocumentAllImport
    }
    '/_authenticated/document/mine/$documentId/edit': {
      preLoaderRoute: typeof AuthenticatedDocumentMineDocumentIdEditImport
      parentRoute: typeof AuthenticatedDocumentMineImport
    }
    '/_authenticated/document/waiting/$documentId/edit': {
      preLoaderRoute: typeof AuthenticatedDocumentWaitingDocumentIdEditImport
      parentRoute: typeof AuthenticatedDocumentWaitingImport
    }
    '/_authenticated/general/customers/$customerId/edit': {
      preLoaderRoute: typeof AuthenticatedGeneralCustomersCustomerIdEditImport
      parentRoute: typeof AuthenticatedGeneralCustomersImport
    }
    '/_authenticated/general/employees/$employeeId/edit': {
      preLoaderRoute: typeof AuthenticatedGeneralEmployeesEmployeeIdEditImport
      parentRoute: typeof AuthenticatedGeneralEmployeesImport
    }
    '/_authenticated/general/suppliers/$supplierId/edit': {
      preLoaderRoute: typeof AuthenticatedGeneralSuppliersSupplierIdEditImport
      parentRoute: typeof AuthenticatedGeneralSuppliersImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AuthenticatedRoute.addChildren([
    AuthenticatedGeneralRoute.addChildren([
      AuthenticatedGeneralCustomersRoute.addChildren([
        AuthenticatedGeneralCustomersNewRoute,
        AuthenticatedGeneralCustomersCustomerIdEditRoute,
      ]),
      AuthenticatedGeneralEmployeesRoute.addChildren([
        AuthenticatedGeneralEmployeesNewRoute,
        AuthenticatedGeneralEmployeesEmployeeIdEditRoute,
      ]),
      AuthenticatedGeneralSuppliersRoute.addChildren([
        AuthenticatedGeneralSuppliersNewRoute,
        AuthenticatedGeneralSuppliersSupplierIdEditRoute,
      ]),
      AuthenticatedGeneralIndexRoute,
    ]),
    AuthenticatedHomeRoute,
    AuthenticatedDocumentAllRoute.addChildren([
      AuthenticatedDocumentAllIndexRoute,
      AuthenticatedDocumentAllDocumentIdEditRoute,
    ]),
    AuthenticatedDocumentMineRoute.addChildren([
      AuthenticatedDocumentMineIndexRoute,
      AuthenticatedDocumentMineDocumentIdEditRoute,
    ]),
    AuthenticatedDocumentWaitingRoute.addChildren([
      AuthenticatedDocumentWaitingIndexRoute,
      AuthenticatedDocumentWaitingDocumentIdEditRoute,
    ]),
  ]),
  LoginRoute,
])

/* prettier-ignore-end */
