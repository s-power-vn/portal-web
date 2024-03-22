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
import { Route as AuthenticatedGeneralEmployeeImport } from './routes/_authenticated/general/employee'
import { Route as AuthenticatedGeneralCustomersImport } from './routes/_authenticated/general/customers'
import { Route as AuthenticatedGeneralEmployeeNewImport } from './routes/_authenticated/general/employee/new'
import { Route as AuthenticatedGeneralEmployeeEmployeeIdEditImport } from './routes/_authenticated/general/employee/$employeeId/edit'

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

const AuthenticatedGeneralEmployeeRoute =
  AuthenticatedGeneralEmployeeImport.update({
    path: '/employee',
    getParentRoute: () => AuthenticatedGeneralRoute,
  } as any)

const AuthenticatedGeneralCustomersRoute =
  AuthenticatedGeneralCustomersImport.update({
    path: '/customers',
    getParentRoute: () => AuthenticatedGeneralRoute,
  } as any)

const AuthenticatedGeneralEmployeeNewRoute =
  AuthenticatedGeneralEmployeeNewImport.update({
    path: '/new',
    getParentRoute: () => AuthenticatedGeneralEmployeeRoute,
  } as any)

const AuthenticatedGeneralEmployeeEmployeeIdEditRoute =
  AuthenticatedGeneralEmployeeEmployeeIdEditImport.update({
    path: '/$employeeId/edit',
    getParentRoute: () => AuthenticatedGeneralEmployeeRoute,
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
    '/_authenticated/general/customers': {
      preLoaderRoute: typeof AuthenticatedGeneralCustomersImport
      parentRoute: typeof AuthenticatedGeneralImport
    }
    '/_authenticated/general/employee': {
      preLoaderRoute: typeof AuthenticatedGeneralEmployeeImport
      parentRoute: typeof AuthenticatedGeneralImport
    }
    '/_authenticated/general/': {
      preLoaderRoute: typeof AuthenticatedGeneralIndexImport
      parentRoute: typeof AuthenticatedGeneralImport
    }
    '/_authenticated/general/employee/new': {
      preLoaderRoute: typeof AuthenticatedGeneralEmployeeNewImport
      parentRoute: typeof AuthenticatedGeneralEmployeeImport
    }
    '/_authenticated/general/employee/$employeeId/edit': {
      preLoaderRoute: typeof AuthenticatedGeneralEmployeeEmployeeIdEditImport
      parentRoute: typeof AuthenticatedGeneralEmployeeImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AuthenticatedRoute.addChildren([
    AuthenticatedGeneralRoute.addChildren([
      AuthenticatedGeneralCustomersRoute,
      AuthenticatedGeneralEmployeeRoute.addChildren([
        AuthenticatedGeneralEmployeeNewRoute,
        AuthenticatedGeneralEmployeeEmployeeIdEditRoute,
      ]),
      AuthenticatedGeneralIndexRoute,
    ]),
    AuthenticatedHomeRoute,
  ]),
  LoginRoute,
])

/* prettier-ignore-end */
