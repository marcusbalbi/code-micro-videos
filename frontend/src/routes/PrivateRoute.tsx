import React, { useCallback } from "react"
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { NotAuthorized } from "../pages/NotAuthorized";
import { useHasRealmHome } from "../hooks/useHasRole";
import { useKeycloak } from "@react-keycloak/web"

interface PrivateRouteProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}
export const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const {component: Component, ...rest} = props;
  const { keycloak } = useKeycloak();
  const hasCatalogAdmin = useHasRealmHome("catalog-admin");
  const render = useCallback(
    (props) => {
      if (keycloak.authenticated) {
        return hasCatalogAdmin ? <Component {...props} /> : <NotAuthorized />;
      }
      return (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      );
    },
    [keycloak.authenticated, Component, hasCatalogAdmin]
  );
  return <Route {...rest} render={render} />;
};

export default PrivateRoute