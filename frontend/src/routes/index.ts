import { RouteProps } from "react-router-dom";
import { CategoryList } from "../pages/category/CategoryList";
import { Dashboard } from "../pages/Dashboard";

interface MyRouteProps extends RouteProps {
  label: string;
}

const routes: Array<MyRouteProps> = [
  {
    label: "Dashboard",
    path: "/",
    component: Dashboard,
    exact: true,
  },
  {
    label: "Listar Categorias",
    path: "/categories",
    component: CategoryList,
    exact: true,
  },
];

export default routes;
