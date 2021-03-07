import { Route, Switch } from "react-router-dom";
import React from "react";
import routes from "./index";

interface Props {}

export const AppRouter: React.FC = (props: Props) => {
  return (
    <Switch>
      {routes.map((route, key) => {
        return <Route
          key={key}
          path={route.path}
          component={route.component}
          exact={route.exact === true}
        />;
      })}
    </Switch>
  );
};
