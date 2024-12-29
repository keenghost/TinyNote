import '@/main/app.scss'
import { router } from '@/main/router'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

const App = () => {
  return <RouterProvider router={router}></RouterProvider>
}

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(<App></App>)
