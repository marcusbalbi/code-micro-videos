import { Grid, GridProps, makeStyles, Theme } from "@material-ui/core";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => {
  return {
    gridItem: {
      padding: theme.spacing(1, 0),
    },
  };
});
interface DefaultFormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  GridContainerProps?: GridProps;
  GridItemProps?: GridProps;
}

const DefaultForm: React.FC<DefaultFormProps> = (props) => {
  const classes = useStyles();
  const { GridItemProps, GridContainerProps, ...others } = props;
  return (
    <form {...others}>
      <Grid {...GridContainerProps} container>
        <Grid className={classes.gridItem} {...GridItemProps} item>
          {props.children}
        </Grid>
      </Grid>
    </form>
  );
};

export default DefaultForm;
