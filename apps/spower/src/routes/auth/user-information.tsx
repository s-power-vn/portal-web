import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user-information')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user-information"!</div>
}
