import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/general/employees/new')({
  component: () => <div>Hello /_authenticated/general/employees/new!</div>
})