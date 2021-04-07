import {
  Divider,
  IconButton,
  MenuItem,
  Menu as MuiMenu,
} from "@material-ui/core";
import React, { useState } from "react";
import AccountBox from "@material-ui/icons/AccountBox";
import { useHasRealmHome } from "../../hooks/useHasRole";

const UserAccountMenu = () => {
  const hasCatalogAdmin = useHasRealmHome("catalog-admin");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
  };

  if (!hasCatalogAdmin) {
    return null;
  }

  return (
    <React.Fragment>
      <IconButton
        edge="end"
        color="inherit"
        arial-label="open-drawer"
        arial-controls="menu-appbar"
        aria-haspopup={true}
        onClick={handleOpen}
      >
        <AccountBox />
      </IconButton>
      <MuiMenu
        id="menu-user-account"
        open={open}
        anchorEl={anchorEl}
        onClose={handleOnClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        getContentAnchorEl={null}
      >
        <MenuItem disabled={true} >Full Cycle</MenuItem>
        <Divider />
        <MenuItem>Minha conta</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MuiMenu>
    </React.Fragment>
  );
};

export default UserAccountMenu;
