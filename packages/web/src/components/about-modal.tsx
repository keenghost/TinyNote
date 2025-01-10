import Modal from '@src/ui-components/modal'

interface IProps {
  visible: boolean
  onCancel?: () => void
}

export default (props: IProps) => {
  return (
    props.visible && (
      <Modal
        title="关于"
        size="auto"
        onCancel={props.onCancel}
        useNoOkButton={true}
        cancelButtonText="关闭"
      >
        <div>
          <a
            href="https://github.com/keenghost/TinyNote"
            target="_blank"
            className="text-sky-600"
          >
            https://github.com/keenghost/TinyNote
          </a>
        </div>
        <div>
          <a
            href="https://github.com/keenghost"
            target="_blank"
            className="text-sky-600"
          >
            @keenghost
          </a>
          <span> MIT</span>
          <span> v0.1.0</span>
        </div>
      </Modal>
    )
  )
}
