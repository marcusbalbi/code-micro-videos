import { RouteProps } from "react-router-dom";
import { CategoryList } from "../pages/category/CategoryList";
import { Dashboard } from "../pages/Dashboard";

export interface MyRouteProps extends RouteProps {
  label: string;
  name: string;
}

const routes: Array<MyRouteProps> = [
  {
    name: "dashboard",
    label: "Dashboard",
    path: "/",
    component: Dashboard,
    exact: true,
  },
  {
    name: "categories.list",
    label: "Listar Categorias",
    path: "/categories",
    component: CategoryList,
    exact: true,
  },
];

export default routes;
