/* eslint-disable no-nested-ternary */
import { Box, Container } from "@material-ui/core";
import Link, { LinkProps } from "@material-ui/core/Link";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Location } from "history";
import MuiBreadcrumbs from "@material-ui/core/Breadcrumbs";
import React from "react";
import { Route } from "react-router";
import RouteParser from "route-parser";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import routes from "../routes";
import { useKeycloak } from "@react-keycloak/web";

const breadcrumbNameMap: { [key: string]: string } = {};

routes.forEach((route) => {
  breadcrumbNameMap[route.path as string] = route.label;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkRouter: {
      color: theme.palette.secondary.main,
      "&:focus, &:active": {
        color: theme.palette.secondary.main,
      },
      "&:hover": {
        color: theme.palette.secondary.dark,
      },
    },
  })
);

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
);

export default function Breadcrumbs() {
  const classes = useStyles();
  const { keycloak } = useKeycloak();
  const makeBreadcrumb = (location: Location) => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    pathnames.unshift("/");
    return (
      <MuiBreadcrumbs aria-label="breadcrumb">
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `${pathnames
            .slice(0, index + 1)
            .join("/")
            .replace("//", "/")}`;
          const route = Object.keys(breadcrumbNameMap).find((path) =>
            new RouteParser(path).match(to)
          );

          if (route === undefined) {
            return false;
          }
          return last ? (
            <Typography color="textPrimary" key={to}>
              {breadcrumbNameMap[route]}
            </Typography>
          ) : (
            <LinkRouter
              color="inherit"
              to={to}
              key={to}
              className={classes.linkRouter}
            >
              {breadcrumbNameMap[route]}
            </LinkRouter>
          );
        })}
      </MuiBreadcrumbs>
    );
  };

  return (
    keycloak.authenticated ? <Container>
      <Box paddingTop={2} paddingBottom={1}>
        <Route>
          {({ location }) => {
            return makeBreadcrumb(location);
          }}
        </Route>
      </Box>
    </Container> : null
  );
}
