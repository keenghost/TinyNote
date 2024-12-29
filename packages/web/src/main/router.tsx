import { httpStatus } from '@/common/api'
import PageLoading from '@/components/page-loading'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'

const PageLogin = lazy(() => import('@/pages/login'))
const PageNotes = lazy(() => import('@/pages/notes'))

const LazyLoad = (PageComponent: React.LazyExoticComponent<() => React.JSX.Element>) => {
  return (
    <Suspense fallback={<PageLoading />}>
      <PageComponent />
    </Suspense>
  )
}

const loader = (to: string) => {
  return async () => {
    try {
      await httpStatus()

      if (to === '/login') {
        window.location.href = '/'
      }
    } catch {
      if (to !== '/login') {
        window.location.href = '/login'
      }
    }

    return true
  }
}

const routerConfig: RouteObject[] = [
  {
    id: 'login',
    path: '/login',
    loader: loader('/login'),
    element: LazyLoad(PageLogin),
    hydrateFallbackElement: <PageLoading />,
    shouldRevalidate: () => false,
  },
  {
    id: 'notes',
    path: '*',
    loader: loader('*'),
    element: LazyLoad(PageNotes),
    hydrateFallbackElement: <PageLoading />,
    shouldRevalidate: () => false,
  },
]

export const router = createBrowserRouter(routerConfig)
