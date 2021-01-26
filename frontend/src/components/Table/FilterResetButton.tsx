import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import React from "react";
import ClearAllIcon from "@material-ui/icons/ClearAll";
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
