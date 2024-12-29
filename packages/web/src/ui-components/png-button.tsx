import { useState } from 'react'

interface IProps {
  pngClass: string
  size?: 'large' | 'medium' | 'small' | 'tiny' | 'extra-tiny'
  className?: string
  onClick?:
    | ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => Promise<void>)
  useLoading?: boolean
}

export default (props: IProps) => {
  const [loading, setLoading] = useState(false)

  async function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (loading) {
      return
    }

    try {
      if (props.useLoading) {
        setLoading(true)
      }

      await props.onClick?.(e)
    } catch (e) {
      throw e
    } finally {
      if (props.useLoading) {
        setLoading(false)
      }
    }
  }

  function getSizeClasses() {
    switch (props.size) {
      case 'large':
        return 'w-40 h-40'
      case 'medium':
        return 'w-36 h-36'
      case 'small':
        return 'w-32 h-32'
      case 'tiny':
        return 'w-28 h-28'
      case 'extra-tiny':
        return 'w-24 h-24'
      default:
        return 'w-44 h-44'
    }
  }

  return (
    <div
      className={[
        'flex cursor-pointer items-center justify-center bg-transparent p-2',
        getSizeClasses(),
        props.className,
      ].join(' ')}
      onClick={e => onClick(e)}
    >
      <div
        className={[
          'bg-position-center bg-contain bg-center bg-no-repeat',
          getSizeClasses(),
          props.className,
          props.pngClass,
        ].join(' ')}
      ></div>
    </div>
  )
}
