import { Route as ReactRoute, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import React from "react";
import routes from "./index";
import { useKeycloak } from "@react-keycloak/web";

interface Props {}

export const AppRouter: React.FC = (props: Props) => {
  const {initialized} = useKeycloak();

  if (!initialized) {
    return <div>Carregando...</div>;
  }

  return (
    <Switch>
      {routes.map((route, key) => {
        const Route = route.auth === true ? PrivateRoute : ReactRoute;
        const routeParams = {
          key,
          component: route.component!,
          ...(route.path && { path: route.path }),
          ...(route.exact && { exact: route.exact }),
        };
        return <Route
          {...routeParams}
        />;
      })}
    </Switch>
  );
};
