import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/email-verify')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/email-verify"!</div>
}
