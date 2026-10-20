import type { ReactNode } from 'react'
import { Route, Routes, generatePath } from 'react-router-dom'

export const routePaths = {
  home: '/',
  restaurant: '/restaurante/:id'
} as const

export function restaurantPath(id: number) {
  return generatePath(routePaths.restaurant, { id: String(id) })
}

export function AppRoutes(pages: {
  home: ReactNode
  restaurant: ReactNode
  notFound: ReactNode
}) {
  return (
    <Routes>
      <Route path={routePaths.home} element={pages.home} />
      <Route path={routePaths.restaurant} element={pages.restaurant} />
      <Route path="*" element={pages.notFound} />
    </Routes>
  )
}
