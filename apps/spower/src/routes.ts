import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';

import { settingsConstructionsRoutes } from './settings.constructions.routes';

export const routes = rootRoute('./root.tsx', [
  index('./index.tsx'),
  route('login', './login.tsx'),
  layout('./private.tsx', [
    route('home', './private/home.tsx'),
    route('messenger', './private/messenger.tsx'),
    route('project', './private/project.tsx', [
      index('./private/project/index.tsx'),
      route('$projectId', './private/project/$projectId.tsx', [
        index('./private/project/$projectId/index.tsx'),
        route('issues', './private/project/$projectId/issues.tsx', [
          index('./private/project/$projectId/issues/index.tsx'),
          route('/me', './private/project/$projectId/issues/me.tsx', [
            index('./private/project/$projectId/issues/me/index.tsx'),
            route(
              '/$issueId',
              './private/project/$projectId/issues/me/$issueId.tsx'
            )
          ]),
          route('/price', './private/project/$projectId/issues/price.tsx', [
            index('./private/project/$projectId/issues/price/index.tsx'),
            route(
              '/$issueId',
              './private/project/$projectId/issues/price/$issueId.tsx'
            )
          ]),
          route('/request', './private/project/$projectId/issues/request.tsx', [
            index('./private/project/$projectId/issues/request/index.tsx'),
            route(
              '/$issueId',
              './private/project/$projectId/issues/request/$issueId.tsx'
            )
          ])
        ]),
        route('contract', './private/project/$projectId/contract.tsx', [
          index('./private/project/$projectId/contract/index.tsx'),
          route('input', './private/project/$projectId/contract/input.tsx'),
          route(
            'monitoring',
            './private/project/$projectId/contract/monitoring.tsx'
          )
        ]),
        route('settings', './private/project/$projectId/settings.tsx')
      ])
    ]),
    route('settings', './private/settings.tsx', [
      index('./private/settings/index.tsx'),
      route('general', './private/settings/general.tsx', [
        index('./private/settings/general/index.tsx'),
        route(
          'departments',
          './private/settings/general/departments/list.tsx',
          [
            route('new', './private/settings/general/departments/new.tsx'),
            route(
              '$departmentId/edit',
              './private/settings/general/departments/edit.tsx'
            )
          ]
        ),
        route('employees', './private/settings/general/employees/list.tsx', [
          route('new', './private/settings/general/employees/new.tsx'),
          route(
            '$employeeId/edit',
            './private/settings/general/employees/edit.tsx'
          )
        ]),
        ...settingsConstructionsRoutes
      ]),
      route('operation', './private/settings/operation.tsx', [
        index('./private/settings/operation/index.tsx'),
        route('objects', './private/settings/operation/objects/list.tsx', [
          route('new', './private/settings/operation/objects/new.tsx'),
          route(
            '$objectId/edit',
            './private/settings/operation/objects/edit.tsx'
          )
        ]),
        route('process', './private/settings/operation/process/list.tsx', [
          route('new', './private/settings/operation/process/new.tsx'),
          route(
            '$processId/edit',
            './private/settings/operation/process/edit.tsx'
          )
        ])
      ])
    ]),
    route('profile', './private/profile.tsx')
  ])
]);
