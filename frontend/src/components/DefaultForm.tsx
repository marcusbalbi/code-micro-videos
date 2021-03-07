import * as React from "react";
import { Grid, GridProps, Theme, makeStyles } from "@material-ui/core";

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
