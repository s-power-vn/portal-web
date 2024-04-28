import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/project/$projectId/issues/all/$issueId')({
  component: () => <div>Hello /_authenticated/project/$projectId/issues/$issueId!</div>
})