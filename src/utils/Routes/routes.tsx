import { Home } from '../../pages/home/Home'
import { DPMaker } from '../../pages/dpmaker/DPMaker'
import type { RouteProps } from './type'

export const routes: RouteProps[] = [
  { path: "/", element: <Home /> },
  { path: "/create", element: <DPMaker /> },
];