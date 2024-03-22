import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/document-mine')({
  component: () => <div>Hello /_authenticated/document-mine!</div>
})