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
import { Route as AuthenticatedHomeRouteImport } from './routes/_authenticated/home/route'
import { Route as AuthenticatedGeneralIndexImport } from './routes/_authenticated/general/index'
import { Route as AuthenticatedDocumentsIndexImport } from './routes/_authenticated/documents/index'
import { Route as AuthenticatedGeneralEmployeeRouteImport } from './routes/_authenticated/general/employee/route'
import { Route as AuthenticatedGeneralCustomersRouteImport } from './routes/_authenticated/general/customers/route'
import { Route as AuthenticatedDocumentsWaitingRouteImport } from './routes/_authenticated/documents/waiting/route'
import { Route as AuthenticatedDocumentsCreatedRouteImport } from './routes/_authenticated/documents/created/route'
import { Route as AuthenticatedDocumentsAllRouteImport } from './routes/_authenticated/documents/all/route'

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

const AuthenticatedHomeRouteRoute = AuthenticatedHomeRouteImport.update({
  path: '/home',
  getParentRoute: () => AuthenticatedRoute,
} as any).lazy(() =>
  import('./routes/_authenticated/home/route.lazy').then((d) => d.Route),
)

const AuthenticatedGeneralIndexRoute = AuthenticatedGeneralIndexImport.update({
  path: '/general/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedDocumentsIndexRoute =
  AuthenticatedDocumentsIndexImport.update({
    path: '/documents/',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedGeneralEmployeeRouteRoute =
  AuthenticatedGeneralEmployeeRouteImport.update({
    path: '/general/employee',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedGeneralCustomersRouteRoute =
  AuthenticatedGeneralCustomersRouteImport.update({
    path: '/general/customers',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedDocumentsWaitingRouteRoute =
  AuthenticatedDocumentsWaitingRouteImport.update({
    path: '/documents/waiting',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedDocumentsCreatedRouteRoute =
  AuthenticatedDocumentsCreatedRouteImport.update({
    path: '/documents/created',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedDocumentsAllRouteRoute =
  AuthenticatedDocumentsAllRouteImport.update({
    path: '/documents/all',
    getParentRoute: () => AuthenticatedRoute,
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
    '/_authenticated/home': {
      preLoaderRoute: typeof AuthenticatedHomeRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/documents/all': {
      preLoaderRoute: typeof AuthenticatedDocumentsAllRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/documents/created': {
      preLoaderRoute: typeof AuthenticatedDocumentsCreatedRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/documents/waiting': {
      preLoaderRoute: typeof AuthenticatedDocumentsWaitingRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/general/customers': {
      preLoaderRoute: typeof AuthenticatedGeneralCustomersRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/general/employee': {
      preLoaderRoute: typeof AuthenticatedGeneralEmployeeRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/documents/': {
      preLoaderRoute: typeof AuthenticatedDocumentsIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/general/': {
      preLoaderRoute: typeof AuthenticatedGeneralIndexImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AuthenticatedRoute.addChildren([
    AuthenticatedHomeRouteRoute,
    AuthenticatedDocumentsAllRouteRoute,
    AuthenticatedDocumentsCreatedRouteRoute,
    AuthenticatedDocumentsWaitingRouteRoute,
    AuthenticatedGeneralCustomersRouteRoute,
    AuthenticatedGeneralEmployeeRouteRoute,
    AuthenticatedDocumentsIndexRoute,
    AuthenticatedGeneralIndexRoute,
  ]),
  LoginRoute,
])

/* prettier-ignore-end */
