import { Grid, Theme, createStyles, makeStyles } from "@material-ui/core";
import { GridProps } from "@material-ui/core/Grid";
import React from "react";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      backgroundColor: "#F1F1F1",
      borderRadius: "4px",
      padding: theme.spacing(1, 1),
      color: theme.palette.secondary.main,
    },
  });
});

interface GridSelectedProps extends GridProps {}

const GridSelected: React.FC<GridSelectedProps> = (props) => {
  const classes = useStyles();
  return (
    <Grid container wrap="wrap" className={classes.root} {...props}>
      {props.children}
    </Grid>
  );
};

export default GridSelected;
