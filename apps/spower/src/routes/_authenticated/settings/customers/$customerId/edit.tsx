import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { api } from 'portal-api'

import { useCallback, useState } from 'react'

import { Modal } from '@minhdtb/storeo-theme'

import { EditCustomerForm } from '../../../../../components'

const Component = () => {
  const [open, setOpen] = useState(true)
  const { history } = useRouter()
  const { customerId } = Route.useParams()
  const queryClient = useQueryClient()
  const search = Route.useSearch()

  const onSuccessHandler = useCallback(async () => {
    setOpen(false)
    history.back()
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: api.customer.byId.getKey(customerId),
      }),
      queryClient.invalidateQueries({
        queryKey: api.customer.list.getKey(search),
      }),
      queryClient.invalidateQueries({
        queryKey: api.customer.listFull.getKey(),
      }),
    ])
  }, [customerId, history, queryClient, search])

  const onCancelHandler = useCallback(() => {
    setOpen(false)
    history.back()
  }, [history])

  return (
    <Modal
      title={'Chỉnh sửa chủ đầu tư'}
      preventOutsideClick={true}
      open={open}
      setOpen={(open) => {
        setOpen(open)
        history.back()
      }}
      id={'edit-customer-modal'}
    >
      <EditCustomerForm
        customerId={customerId}
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  )
}

export const Route = createFileRoute(
  '/_authenticated/settings/customers/$customerId/edit',
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { customerId } }) =>
    queryClient?.ensureQueryData(api.customer.byId.getOptions(customerId)),
})
