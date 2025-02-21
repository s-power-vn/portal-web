import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { api } from 'portal-api'

import { useCallback, useState } from 'react'

import { Modal } from '@minhdtb/storeo-theme'

import { EditMaterialForm } from '../../../../../components'

const Component = () => {
  const [open, setOpen] = useState(true)
  const { history } = useRouter()
  const queryClient = useQueryClient()
  const { materialId } = Route.useParams()
  const search = Route.useSearch()

  const onSuccessHandler = useCallback(async () => {
    setOpen(false)
    history.back()
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: api.material.byId.getKey(materialId),
      }),
      queryClient.invalidateQueries({
        queryKey: api.material.list.getKey(search),
      }),
    ])
  }, [history, materialId, queryClient, search])

  const onCancelHandler = useCallback(() => {
    setOpen(false)
    history.back()
  }, [history])

  return (
    <Modal
      title={'Chỉnh sửa vật tư'}
      preventOutsideClick={true}
      open={open}
      setOpen={(open) => {
        setOpen(open)
        history.back()
      }}
      id={'edit-material-modal'}
    >
      <EditMaterialForm
        materialId={materialId}
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  )
}

export const Route = createFileRoute(
  '/_authenticated/settings/materials/$materialId/edit',
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { materialId } }) =>
    queryClient?.ensureQueryData(api.material.byId.getOptions(materialId)),
})
