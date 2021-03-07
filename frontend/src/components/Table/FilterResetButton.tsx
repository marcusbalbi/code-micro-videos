import { IconButton, Tooltip, makeStyles } from "@material-ui/core";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import React from "react";
interface FilterResetButtonProps {
  handleClick: () => void;
}

const useStyles = makeStyles((theme) => {
  return {
    iconButton: (theme as any).overrides.MUIDataTableToolbar.icon,
  };
});

export const FilterResetButton: React.FC<FilterResetButtonProps> = (props) => {
  const classes = useStyles();
  return (
    <Tooltip title="Limpar Busca">
      <IconButton className={classes.iconButton} onClick={props.handleClick}>
        <ClearAllIcon />
      </IconButton>
    </Tooltip>
  );
};
