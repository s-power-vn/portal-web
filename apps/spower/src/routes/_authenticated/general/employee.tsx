import { PlusIcon } from '@radix-ui/react-icons';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';

import { Button } from '@storeo/theme';


const Employee = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        className={'flex gap-1'}
        onClick={() =>
          navigate({
            to: '/general/employee/new',
            replace: false
          })
        }
      >
        <PlusIcon />
        Thêm nhân viên
      </Button>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/general/employee')({
  component: Employee
});
