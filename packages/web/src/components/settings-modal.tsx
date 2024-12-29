import Modal from '@/ui-components/modal'

interface IProps {
  visible: boolean
  onCancel?: () => void
}

export default (props: IProps) => {
  async function onOk() {}

  function onCancel() {
    props.onCancel?.()
  }

  return (
    props.visible && (
      <Modal
        title="设置"
        size="tiny"
        onOk={onOk}
        onCancel={onCancel}
        useLoading={true}
      >
        <div>TODO:</div>
        <div>Change Server Config</div>
        <div>Change Local Config</div>
        <div>Change Font</div>
      </Modal>
    )
  )
}
