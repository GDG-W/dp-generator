import { DPMaker } from "../../pages/dpmaker/DPMaker";
import { Upload } from "../../pages/dpmaker/components";
import { Home } from "../../pages/home/Home";
import type { RouteProps } from "./type";

export const routes: RouteProps[] = [
  { path: "/", element: <Home /> },
  { path: "/create", element: <DPMaker /> },
  { path: "/upload", element: <Upload onImageUpload={() => {}} /> },
];
