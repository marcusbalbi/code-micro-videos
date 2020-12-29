import { RouteProps } from "react-router-dom";
import CategoryListPage from "../pages/category/CategoryListPage";
import CategoryFormPage from "../pages/category/CategoryFormPage";
import { CastMemberList } from "../pages/cast-member/CastMemberList";
import { GenreList } from "../pages/genre/GenreList";
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
    component: CategoryListPage,
    exact: true,
  },
  {
    name: "categories.create",
    label: "Criar Categoria",
    path: "/categories/create",
    component: CategoryFormPage,
    exact: true,
  },
  {
    name: "categories.edit",
    label: "Editar Categoria",
    path: "/categories/:id/edit",
    component: CategoryFormPage,
    exact: true,
  },
  {
    name: "cast_members.list",
    label: "Listar Membros de Elenco",
    path: "/cast-members",
    component: CastMemberList,
    exact: true,
  },
  {
    name: "cast_members.create",
    label: "Criar Membro de Elenco",
    path: "/cast-members/create",
    component: CastMemberList,
    exact: true,
  },
  {
    name: "cast_members.edit",
    label: "Editar Membro de Elenco",
    path: "/cast-members/:id/edit",
    component: CastMemberList,
    exact: true,
  },
  {
    name: "genres.list",
    label: "Listar Gêneros",
    path: "/genres",
    component: GenreList,
    exact: true,
  },
  {
    name: "genres.create",
    label: "Criar Gênero",
    path: "/genres/create",
    component: CastMemberList,
    exact: true,
  },
  {
    name: "genres.edit",
    label: "Editar Gênero",
    path: "/genres/:id/edit",
    component: CastMemberList,
    exact: true,
  },
];

export default routes;
