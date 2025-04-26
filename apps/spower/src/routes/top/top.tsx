import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { organizationApi } from 'portal-api';

import { useCallback } from 'react';

import { Button, showModal } from '@minhdtb/storeo-theme';

import { NewOrganizationForm } from '../../components/domains/organization';
import { useInvalidateQueries } from '../../hooks';

const roleMap: Record<string, string> = {
  org_admin: 'Quản trị viên',
  org_operator: 'Điều hành',
  org_member: 'Thành viên'
};

const roleColorMap: Record<string, { bg: string; text: string }> = {
  org_admin: {
    bg: 'bg-purple-100',
    text: 'text-purple-800'
  },
  org_operator: {
    bg: 'bg-blue-100',
    text: 'text-blue-800'
  },
  org_member: {
    bg: 'bg-green-100',
    text: 'text-green-800'
  }
};

const getRoleLabel = (role: string) => roleMap[role] || role;

const getRoleColor = (role: string) =>
  roleColorMap[role] || { bg: 'bg-gray-100', text: 'text-gray-800' };

export const Route = createFileRoute('/_private/_top/top')({
  component: RouteComponent
});

function RouteComponent() {
  const { data: organizations } = organizationApi.list.useSuspenseQuery();

  const invalidates = useInvalidateQueries();

  const navigate = useNavigate();

  const handleCreateOrganization = useCallback(() => {
    showModal({
      title: 'Tạo tổ chức',
      children: ({ close }) => {
        return (
          <NewOrganizationForm
            onSuccess={() => {
              invalidates([organizationApi.list.getKey()]);
              close();
            }}
          />
        );
      }
    });
  }, [invalidates]);

  const handleOrganizationClick = useCallback(
    (id: string) => {
      navigate({
        to: '/$organizationId/home',
        params: {
          organizationId: id
        }
      });
    },
    [navigate]
  );

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tổ chức</h1>
        <Button onClick={handleCreateOrganization}>Tạo tổ chức</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {organizations.length === 0 ? (
          <div className="col-span-full">
            <p className="text-lg font-medium text-gray-900">
              Chưa có tổ chức nào
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Tạo tổ chức để quản lý các dự án và thành viên của bạn
            </p>
          </div>
        ) : (
          organizations.map(org => {
            const userRole = org.role || '';
            const roleColor = getRoleColor(userRole);

            return (
              <div
                key={org.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                onClick={() => handleOrganizationClick(org.id)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {org.name}
                  </h2>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${roleColor.bg} ${roleColor.text}`}
                  >
                    {getRoleLabel(userRole)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {org.members.length} thành viên
                  </div>

                  <div className="flex -space-x-2 overflow-hidden">
                    {org.members.slice(0, 5).map(member => {
                      return (
                        <img
                          key={member.user?.id}
                          className={`inline-block h-8 w-8 rounded-full ring-2 ring-white`}
                          src={
                            member.user?.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user?.name ?? '')}`
                          }
                          alt={member.user?.name ?? ''}
                          title={`${member.user?.name} (${getRoleLabel(member.role)})`}
                        />
                      );
                    })}
                    {org.members.length > 5 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 ring-2 ring-white">
                        <span className="text-xs font-medium text-gray-500">
                          +{org.members.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
