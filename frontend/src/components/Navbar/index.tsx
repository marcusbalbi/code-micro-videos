import {
  AppBar,
  Theme,
  Toolbar,
  Typography,
  makeStyles,
} from "@material-ui/core";
import LoginButton from "./LoginButton";
import { Menu } from "./Menu";
import React from "react";
import UserAccountMenu from "./UserAccountMenu";

import logo from "../../static/img/logo.png";

const useStyles = makeStyles((theme: Theme) => {
  return {
    toolbar: {
      backgroundColor: "#000000",
    },
    title: {
      flexGrow: 1,
      textAlign: "center",
    },
    logo: {
      width: 100,
      [theme.breakpoints.up("sm")]: {
        width: 170,
      },
    },
  };
});

export const Navbar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <Menu />
        <Typography className={classes.title}>
          <img className={classes.logo} src={logo} alt="Logo" />
        </Typography>
        <LoginButton />
        <UserAccountMenu />
      </Toolbar>
    </AppBar>
  );
};
