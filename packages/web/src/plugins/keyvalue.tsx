interface IProps {
  value: string
  onChange: (value: string) => void
  className?: string
  editMode?: 'source' | 'preview'
  readonly?: boolean
}

export default (props: IProps) => {
  return <div>{props.value}</div>
}
