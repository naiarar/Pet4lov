import type { ComponentType } from 'react'
import { Navigate, type RouteObject } from 'react-router'
import { RequireAuth } from './auth/RequireAuth'
import { Layout } from './components/Layout'
import { Spinner } from './components/Spinner'

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default })

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    hydrateFallbackElement: <Spinner />,
    children: [
      { index: true, element: <Navigate to="/pets" replace /> },
      { path: 'pets', handle: { title: 'Pets para adoção | Pet4lov' }, lazy: page(() => import('./pages/PetListPage')) },
      { path: 'pets/:id', handle: { title: 'Pet | Pet4lov' }, lazy: page(() => import('./pages/PetDetailPage')) },
      { path: 'ongs', handle: { title: 'ONGs parceiras | Pet4lov' }, lazy: page(() => import('./pages/OngListPage')) },
      { path: 'cadastro', handle: { title: 'Criar conta | Pet4lov' }, lazy: page(() => import('./pages/RegisterPage')) },
      { path: 'login', handle: { title: 'Entrar | Pet4lov' }, lazy: page(() => import('./pages/LoginPage')) },
      {
        element: <RequireAuth />,
        children: [
          { path: 'pets/novo', handle: { title: 'Cadastrar pet | Pet4lov' }, lazy: page(() => import('./pages/PetFormPage')) },
          { path: 'pets/:id/editar', handle: { title: 'Editar pet | Pet4lov' }, lazy: page(() => import('./pages/PetFormPage')) },
          { path: 'ongs/nova', handle: { title: 'Cadastrar ONG | Pet4lov' }, lazy: page(() => import('./pages/OngFormPage')) },
          { path: 'ongs/:id/editar', handle: { title: 'Editar ONG | Pet4lov' }, lazy: page(() => import('./pages/OngFormPage')) },
          { path: 'minha-conta', handle: { title: 'Minha conta | Pet4lov' }, lazy: page(() => import('./pages/AccountPage')) },
        ],
      },
      { path: '*', element: <Navigate to="/pets" replace /> },
    ],
  },
]
