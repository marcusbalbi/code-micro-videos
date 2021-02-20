import React from "react";
import { Grid, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { GridProps } from "@material-ui/core/Grid";

interface GridSelectedItemProps extends GridProps {
  onDelete: () => void;
}

const GridSelectedItem: React.FC<GridSelectedItemProps> = (props) => {
  const { onDelete, children, ...others } = props
  return (
    <Grid {...others}>
      <Grid container alignItems={"center"} spacing={3}>
        <Grid item xs={1}>
          <IconButton size="small" color={"inherit"} onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Grid item xs={10} md={11}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridSelectedItem;
