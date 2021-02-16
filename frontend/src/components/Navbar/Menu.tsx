import React, { useState } from "react";
import { IconButton, Menu as MuiMenu, MenuItem } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import routes, { MyRouteProps } from "../../routes";
import { Link } from "react-router-dom";

const listRoutes = {
  dashboard: "Dashboard",
  "categories.list": "Categorias",
  "cast_members.list": "Membros de elenco",
  "genres.list": "Gêneros",
  "videos.list": "Videos",
};
const menuRoutes = routes.filter((route) =>
  Object.keys(listRoutes).includes(route.name)
);

export const Menu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
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
      <MuiMenu
        id="menu-appbar"
        open={open}
        anchorEl={anchorEl}
        onClose={handleOnClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        getContentAnchorEl={null}
      >
        {Object.keys(listRoutes).map((routeName, key) => {
          const route = menuRoutes.find(
            (route) => route.name === routeName
          ) as MyRouteProps;
          return (
            <MenuItem
              key={key}
              component={Link}
              to={route.path as string}
              onClick={handleOnClose}
            >
              {listRoutes[routeName]}
            </MenuItem>
          );
        })}
      </MuiMenu>
    </React.Fragment>
  );
};
