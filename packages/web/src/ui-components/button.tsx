import { useState } from 'react'

export type IButtonType =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'transparent'

export type IButtonSize =
  | 'default'
  | 'large'
  | 'medium'
  | 'small'
  | 'tiny'
  | 'large-wide'
  | 'medium-wide'
  | 'small-wide'
  | 'tiny-wide'

interface IProps {
  type?: IButtonType
  size?: IButtonSize
  onClick?:
    | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>)
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  disabled?: boolean
  useLoading?: boolean
}

export default (props: IProps) => {
  const [loading, setLoading] = useState(false)

  async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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

  function getTypeClasses() {
    const type = props.type || 'default'

    if (props.disabled) {
      switch (type) {
        case 'primary':
          return 'bg-[#F0F1F2] text-[rgba(0,0,0,0.1)] cursor-not-allowed'
        case 'success':
          return 'bg-[#F0F1F2] text-[rgba(0,0,0,0.1)] cursor-not-allowed'
        case 'warning':
          return 'bg-[#F0F1F2] text-[rgba(0,0,0,0.1)] cursor-not-allowed'
        case 'error':
          return 'bg-[#F0F1F2] text-[rgba(0,0,0,0.1)] cursor-not-allowed'
        case 'transparent':
          return 'text-[rgba(107,114,128,1)] cursor-not-allowed'
        default:
          return 'bg-[#F0F1F2] text-[rgba(0,0,0,0.1)] cursor-not-allowed'
      }
    } else {
      switch (type) {
        case 'primary':
          return 'bg-blue-500 has-hover:hover:bg-blue-700 text-white'
        case 'success':
          return 'bg-green-500 has-hover:hover:bg-green-700 text-white'
        case 'warning':
          return 'bg-yellow-500 has-hover:hover:bg-yellow-700 text-white'
        case 'error':
          return 'bg-red-500 has-hover:hover:bg-red-700 text-white'
        case 'transparent':
          return 'has-hover:hover:bg-[rgba(243,244,246,1)] text-[rgba(107,114,128,1)]'
        default:
          return 'bg-[#E0E1E2] has-hover:hover:bg-[#CACBCD] text-[rgba(0,0,0,0.6)]'
      }
    }
  }

  function getSizeClasses() {
    const size = props.size || 'default'

    switch (size) {
      case 'large':
        return 'py-8 px-12'
      case 'large-wide':
        return 'py-8 px-16'

      case 'medium':
        return 'py-6 px-10'
      case 'medium-wide':
        return 'py-6 px-14'

      case 'small':
        return 'py-4 px-8'
      case 'small-wide':
        return 'py-4 px-12'

      case 'tiny':
        return 'py-2 px-6'
      case 'tiny-wide':
        return 'py-2 px-10'

      default:
        return 'py-6 px-10'
    }
  }

  return (
    <button
      tabIndex={-1}
      className={[
        'rounded-3 relative transition-colors duration-200',
        getTypeClasses(),
        getSizeClasses(),
        props.className,
      ].join(' ')}
      style={props.style}
      onClick={onClick}
      disabled={props.disabled}
    >
      {props.children}

      {loading && (
        <div className="rounded-3 absolute bottom-0 left-0 right-0 top-0 z-[1] flex items-center justify-center bg-[rgba(255,255,255,0.5)]">
          <div className="button-loading"></div>
        </div>
      )}
    </button>
  )
}
