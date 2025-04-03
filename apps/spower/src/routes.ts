import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';

import { getProjectRoutes, getSettingsRoutes } from './modules.gen';

export const routes = rootRoute('./root.tsx', [
  index('./index.tsx'),
  route('email-login', './auth/email-login.tsx'),
  route('email-input', './auth/email-input.tsx'),
  route('email-verify', './auth/email-verify.tsx'),
  route('password-input', './auth/password-input.tsx'),
  route('user-information', './auth/user-information.tsx'),
  route('signin', './auth/signin.tsx'),
  layout('./private.tsx', [
    layout('./top.tsx', [route('top', './top/top.tsx')]),
    layout('./organization.tsx', [
      route('home', './organization/home.tsx'),
      route('messenger', './organization/messenger.tsx'),
      route('project', './organization/project.tsx', [
        index('./organization/project/index.tsx'),
        route('$projectId', './organization/project/$projectId.tsx', [
          index('./organization/project/$projectId/index.tsx'),
          route('issues', './organization/project/$projectId/issues.tsx', [
            index('./organization/project/$projectId/issues/index.tsx'),
            route('/me', './organization/project/$projectId/issues/me.tsx', [
              index('./organization/project/$projectId/issues/me/index.tsx'),
              route(
                '/$issueId',
                './organization/project/$projectId/issues/me/$issueId.tsx'
              )
            ]),
            route(
              '/price',
              './organization/project/$projectId/issues/price.tsx',
              [
                index(
                  './organization/project/$projectId/issues/price/index.tsx'
                ),
                route(
                  '/$issueId',
                  './organization/project/$projectId/issues/price/$issueId.tsx'
                )
              ]
            ),
            route(
              '/request',
              './organization/project/$projectId/issues/request.tsx',
              [
                index(
                  './organization/project/$projectId/issues/request/index.tsx'
                ),
                route(
                  '/$issueId',
                  './organization/project/$projectId/issues/request/$issueId.tsx'
                )
              ]
            )
          ]),
          ...getProjectRoutes(),
          route('settings', './organization/project/$projectId/settings.tsx')
        ])
      ]),
      route('settings', './organization/settings.tsx', [
        index('./organization/settings/index.tsx'),
        route('general', './organization/settings/general.tsx', [
          index('./organization/settings/general/index.tsx'),
          route(
            'customers',
            './organization/settings/general/customers/list.tsx',
            [
              route('new', './organization/settings/general/customers/new.tsx'),
              route(
                '$customerId/edit',
                './organization/settings/general/customers/edit.tsx'
              )
            ]
          ),
          route(
            'departments',
            './organization/settings/general/departments/list.tsx',
            [
              route(
                'new',
                './organization/settings/general/departments/new.tsx'
              ),
              route(
                '$departmentId/edit',
                './organization/settings/general/departments/edit.tsx'
              )
            ]
          ),
          route(
            'employees',
            './organization/settings/general/employees/list.tsx',
            [
              route('new', './organization/settings/general/employees/new.tsx'),
              route(
                '$employeeId/edit',
                './organization/settings/general/employees/edit.tsx'
              )
            ]
          ),
          ...getSettingsRoutes()
        ]),
        route('operation', './organization/settings/operation.tsx', [
          index('./organization/settings/operation/index.tsx'),
          route(
            'objects',
            './organization/settings/operation/objects/list.tsx',
            [
              route('new', './organization/settings/operation/objects/new.tsx'),
              route(
                '$objectId/edit',
                './organization/settings/operation/objects/edit.tsx'
              )
            ]
          ),
          route(
            'process',
            './organization/settings/operation/process/list.tsx',
            [
              route('new', './organization/settings/operation/process/new.tsx'),
              route(
                '$processId/edit',
                './organization/settings/operation/process/edit.tsx'
              )
            ]
          )
        ])
      ]),
      route('profile', './organization/profile.tsx')
    ])
  ])
]);
