import {
  Fade,
  IconButton,
  ListItemSecondaryAction,
  Theme,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { hasError, isFinished } from "../../store/uploads/getters";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Creators } from "../../store/uploads";
import DeleteIcon from "@material-ui/icons/Delete";
import ErrorIcon from "@material-ui/icons/Error";
import { Upload } from "../../store/uploads/types";
import { useDebounce } from "use-debounce/lib";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme: Theme) => {
  return {
    successIcon: {
      color: theme.palette.success.main,
    },
    errorIcon: {
      color: theme.palette.error.main,
    },
  };
});

interface UploadActionProps {
  upload: Upload;
  hover: boolean;
}

const UploadAction: React.FC<UploadActionProps> = (props) => {
  const classes = useStyles();
  const { upload, hover } = props;
  const dispatch = useDispatch();
  const error = hasError(upload);
  const [show, setShow] = useState(false);
  const [debouncedShow] = useDebounce(show, 2500);

  useEffect(() => {
    setShow(isFinished(upload));
  }, [upload]);
  return (
    debouncedShow ? <Fade in={true} timeout={{ enter: 1000 }}>
      <ListItemSecondaryAction>
        <span hidden={hover}>
          {upload.progress === 1 && !error && (
            <IconButton className={classes.successIcon} edge={"end"}>
              <CheckCircleIcon />
            </IconButton>
          )}
          {error && (
            <IconButton className={classes.errorIcon} edge={"end"}>
              <ErrorIcon />
            </IconButton>
          )}
        </span>
        <span hidden={!hover}>
          <IconButton
            color={"primary"}
            edge={"end"}
            onClick={() => {
              dispatch(
                Creators.removeUpload({
                  id: upload.video.id || "",
                })
              );
            }}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </ListItemSecondaryAction>
    </Fade> : null
  );
};

export default UploadAction;
