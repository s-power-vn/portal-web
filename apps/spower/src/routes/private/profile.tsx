import { createFileRoute } from '@tanstack/react-router';

import { PageHeader } from '../../components';
import { EditProfileForm } from '../../components/domains/user/form/edit-profile-form';

export const Route = createFileRoute('/_private/profile')({
  component: () => (
    <>
      <PageHeader title={'Cài đặt người dùng'} />
      <div className={' mt-2 w-1/2 p-2'}>
        <EditProfileForm />
      </div>
    </>
  )
});
