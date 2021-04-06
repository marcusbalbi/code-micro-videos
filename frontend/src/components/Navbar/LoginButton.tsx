import * as React from "react";
import { Button } from "@material-ui/core";
import { useKeycloak } from "@react-keycloak/web";

interface LoginButtonProps {}

const LoginButton: React.FC<LoginButtonProps> = (props) => {
  const { keycloak, initialized } = useKeycloak();
  if (!initialized || !keycloak.authenticated) {
    return <Button color="inherit">Login</Button>;
  }
  return null;
};

export default LoginButton;
