import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/document-all')({
  component: () => <div>Hello /_authenticated/document-all!</div>
})