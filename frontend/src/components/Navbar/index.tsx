import React, { useState } from "react";
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Theme,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOnClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          arial-label="open-drawer"
          arial-controls="menu-appbar"
          aria-haspopup={true}
          onClick={handleOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          open={open}
          anchorEl={anchorEl}
          onClose={handleOnClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          getContentAnchorEl={null}
        >
          <MenuItem>Categorias</MenuItem>
          <MenuItem>Membros</MenuItem>
          <MenuItem>Gêneros</MenuItem>
        </Menu>
        <Typography className={classes.title}>
          <img className={classes.logo} src={logo} alt="Logo" />
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};
