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
import { FileUpload, Upload } from "../../store/uploads/types";
import { useDispatch } from "react-redux";
import { Creators } from "../../store/uploads";
import { hasError } from "../../store/uploads/getters";

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

interface UploadActionProps {
  uploadOrFile: Upload | FileUpload;
}

const UploadAction: React.FC<UploadActionProps> = (props) => {
  const classes = useStyles();
  const { uploadOrFile } = props;
  const error = hasError(uploadOrFile);
  const dispatch = useDispatch();
  return (
    <Fade in={true} timeout={{ enter: 1000 }}>
      <>
        {uploadOrFile.progress === 1 && !error && (
          <CheckCircleIcon className={classes.successIcon} />
        )}
        {error && <ErrorIcon className={classes.errorIcon} />}
        <>
          <Divider className={classes.divider} orientation={"vertical"} />
          <IconButton onClick={() => { dispatch(Creators.removeUpload({ id: (uploadOrFile as any).video.id }));  }}>
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
