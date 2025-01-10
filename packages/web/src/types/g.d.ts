declare module '*.module.scss' {
  const content: Record<string, string>
  export default content
}

declare module '*.module.css' {
  const content: Record<string, string>
  export default content
}

declare module '*.png' {
  const value: string
  export = value
}
