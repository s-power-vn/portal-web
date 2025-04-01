import { createFileRoute } from '@tanstack/react-router';
import { object, string } from 'yup';

const searchSchema = object().shape({
  email: string().email('Email không hợp lệ').required('Hãy nhập email')
});

export const Route = createFileRoute('/_private/user-information')({
  component: RouteComponent,
  validateSearch: input => searchSchema.validateSync(input)
});

function RouteComponent() {
  return <div>Hello "/user-information"!</div>;
}
