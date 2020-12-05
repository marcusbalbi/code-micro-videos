import React, { useState } from "react";
import { IconButton, Menu as MuiMenu, MenuItem } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

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
        <MenuItem>Categorias</MenuItem>
        <MenuItem>Membros</MenuItem>
        <MenuItem>Gêneros</MenuItem>
      </MuiMenu>
    </React.Fragment>
  );
};
