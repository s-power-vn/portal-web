import { createFileRoute, useRouter } from '@tanstack/react-router'
import { api } from 'portal-api'

import { useCallback, useState } from 'react'

import { Modal } from '@minhdtb/storeo-theme'

import { NewDepartmentForm } from '../../../../../components'
import { useInvalidateQueries } from '../../../../../hooks'

const Component = () => {
  const [open, setOpen] = useState(true)
  const { history } = useRouter()
  const invalidates = useInvalidateQueries()

  const onSuccessHandler = useCallback(() => {
    setOpen(false)
    invalidates([api.department.list.getKey()])
    history.back()
  }, [history, invalidates])

  const onCancelHandler = useCallback(() => {
    setOpen(false)
    history.back()
  }, [history])

  return (
    <Modal
      title={'Thêm phòng ban'}
      preventOutsideClick={true}
      open={open}
      setOpen={(open) => {
        setOpen(open)
        history.back()
      }}
      id={'new-department-modal'}
    >
      <NewDepartmentForm
        onSuccess={onSuccessHandler}
        onCancel={onCancelHandler}
      />
    </Modal>
  )
}

export const Route = createFileRoute(
  '/_private/_organization/settings/general/departments/new',
)({
  component: Component,
})
