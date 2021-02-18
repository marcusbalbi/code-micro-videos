import React from "react";
import { makeStyles, Grid, createStyles, Theme } from "@material-ui/core";
import { GridProps } from "@material-ui/core/Grid";

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

export const Page: React.FC<GridSelectedProps> = (props) => {
  const classes = useStyles();
  return (
    <Grid container wrap="wrap" className={classes.root} {...props} >
      {props.children}
    </Grid>
  );
};
