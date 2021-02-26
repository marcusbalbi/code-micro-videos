import React from "react";
import {
  Divider,
  Fade,
  IconButton,
  makeStyles,
  Theme,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => {
  return {
    successIcon: {
      color: theme.palette.success.main,
      marginLeft: theme.spacing(1),
    },
    errorIcon: {
      color: theme.palette.error.main,
      marginLeft: theme.spacing(1),
    },
    divider: {
      height: "20px",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  };
});

interface UploadActionProps {}

const UploadAction: React.FC<UploadActionProps> = (props) => {
  const classes = useStyles();

  return (
    <Fade in={true} timeout={{ enter: 1000 }}>
      <>
        <CheckCircleIcon className={classes.successIcon} />
        <ErrorIcon className={classes.errorIcon} />
        <>
          <Divider className={classes.divider} orientation={"vertical"} />
          <IconButton>
            <DeleteIcon color={"primary"} />
          </IconButton>
          <IconButton component={Link} to={`/videos/uuid/edit`}>
            <EditIcon color={"primary"} />
          </IconButton>
        </>
      </>
    </Fade>
  );
};

export default UploadAction;
