import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, type InitialEntry } from 'react-router'
import { routes } from '@/app/router'

/** Renders the real route tree (AppShell included) at the given URL or location. */
export function renderRoute(entry: InitialEntry) {
  const router = createMemoryRouter(routes, { initialEntries: [entry] })
  return { router, ...render(<RouterProvider router={router} />) }
}
