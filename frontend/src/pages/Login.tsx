import { Redirect, useLocation } from "react-router";
import React from "react";
import Waiting from "../components/Waiting";
import { useKeycloak } from "@react-keycloak/web";

interface LoginProps {}

export const Login = (props: LoginProps) => {
  const {keycloak} = useKeycloak();
  const location = useLocation();

  const { from } = location.state as any || { from: { pathname: "/" } };

  if (keycloak.authenticated === true) {
    return <Redirect to={from} />
  }

  keycloak.login({
    redirectUri: `${window.location.origin}${process.env.REACT_APP_BASENAME}${from.pathname}`
  });

  return <Waiting />
}

export default Login;
