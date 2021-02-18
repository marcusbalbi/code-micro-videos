import React from "react";
import { Grid, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { GridProps } from "@material-ui/core/Grid";

interface GridSelectedItemProps {
  handleClick: () => void;
  GridProps?: GridProps;
}

const GridSelectedItem: React.FC<GridSelectedItemProps> = (props) => {
  return (
    <Grid {...props.GridProps}>
      <Grid container alignItems={"center"} spacing={3}>
        <Grid item xs={1}>
          <IconButton
            size="small"
            color={"inherit"}
            onClick={props.handleClick}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Grid item xs={10} md={11} >
          {props.children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridSelectedItem;
