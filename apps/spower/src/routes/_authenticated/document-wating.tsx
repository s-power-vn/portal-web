import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/document-wating')({
  component: () => <div>Hello /_authenticated/document-wating!</div>
})