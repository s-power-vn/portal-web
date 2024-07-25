import { createFileRoute } from '@tanstack/react-router';

import { PageHeader } from '../../../components';
import { EditProfileForm } from '../../../components/models/user/edit-profile-form';

export const Route = createFileRoute('/_authenticated/user/profile')({
  component: () => (
    <>
      <PageHeader title={'Cài đặt người dùng'} />
      <div className={' mt-2 w-1/2 p-2'}>
        <EditProfileForm />
      </div>
    </>
  )
});
