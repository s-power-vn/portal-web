import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/project/$projectId/settings')({
  component: () => <div>Hello /_authenticated/project/$projectId/settings!</div>
})