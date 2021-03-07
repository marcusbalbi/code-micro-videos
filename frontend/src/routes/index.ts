import CastMemberFormPage from "../pages/cast-member/CastMemberFormPage";
import CastMemberListPage from "../pages/cast-member/CastMemberListPage";
import CategoryFormPage from "../pages/category/CategoryFormPage";
import CategoryListPage from "../pages/category/CategoryListPage";
import { Dashboard } from "../pages/Dashboard";
import GenreFormPage from "../pages/genre/GenreFormPage";
import GenreListPage from "../pages/genre/GenreListPage";
import { RouteProps } from "react-router-dom";
import UploadPage from "../pages/uploads";
import VideoFormPage from "../pages/video/VideoFormPage";
import VideoListPage from "../pages/video/VideoListPage";

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
    component: CastMemberListPage,
    exact: true,
  },
  {
    name: "cast_members.create",
    label: "Criar Membro de Elenco",
    path: "/cast-members/create",
    component: CastMemberFormPage,
    exact: true,
  },
  {
    name: "cast_members.edit",
    label: "Editar Membro de Elenco",
    path: "/cast-members/:id/edit",
    component: CastMemberFormPage,
    exact: true,
  },
  {
    name: "genres.list",
    label: "Listar Gêneros",
    path: "/genres",
    component: GenreListPage,
    exact: true,
  },
  {
    name: "genres.create",
    label: "Criar Gênero",
    path: "/genres/create",
    component: GenreFormPage,
    exact: true,
  },
  {
    name: "genres.edit",
    label: "Editar Gênero",
    path: "/genres/:id/edit",
    component: GenreFormPage,
    exact: true,
  },
  {
    name: "videos.list",
    label: "Listar Videos",
    path: "/videos",
    component: VideoListPage,
    exact: true,
  },
  {
    name: "videos.create",
    label: "Criar Video",
    path: "/videos/create",
    component: VideoFormPage,
    exact: true,
  },
  {
    name: "videos.edit",
    label: "Editar Video",
    path: "/videos/:id/edit",
    component: VideoFormPage,
    exact: true,
  },
  {
    name: "uploads",
    label: "Uploads",
    path: "/uploads",
    component: UploadPage,
    exact: true,
  },
];

export default routes;
