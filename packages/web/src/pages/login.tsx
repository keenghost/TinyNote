import { httpLogin } from '@/common/api'
import { useState } from 'react'

export default () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function onLoginClick() {
    await httpLogin(username, password)

    window.location.href = '/'
  }

  return (
    <div className="flow-bg fixed bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center">
      <div
        className="text-36 mb-32 text-center font-bold text-white"
        style={{ fontFamily: 'logo' }}
      >
        TINY NOTE
      </div>

      <input
        name="username"
        className="mb-32 w-[328px] rounded-l-full rounded-r-full bg-[#fff]/[.7] p-8 indent-12 outline-none placeholder:text-[#999]"
        placeholder="管理员用户名"
        autoComplete="on"
        autoFocus={true}
        onKeyUp={e => e.key === 'Enter' && onLoginClick()}
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        name="password"
        className="mb-32 w-[328px] rounded-l-full rounded-r-full bg-[#fff]/[.7] p-8 indent-12 outline-none placeholder:text-[#999]"
        placeholder="管理员密码"
        auto-complete="on"
        type="password"
        onKeyUp={e => e.key === 'Enter' && onLoginClick()}
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        className="mb-[80px] w-[328px] rounded-l-full rounded-r-full bg-[#303f9f] p-8 text-white hover:bg-[#1976d2]"
        onClick={onLoginClick}
      >
        登录
      </button>
    </div>
  )
}
