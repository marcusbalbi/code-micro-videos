import { CircularProgress, Fade, Theme, makeStyles } from "@material-ui/core";
import { FileUpload, Upload } from "../store/uploads/types";
import React from "react";
import { grey } from "@material-ui/core/colors";
import { hasError } from "../store/uploads/getters";

const useStyles = makeStyles((theme: Theme) => {
  return {
    progressContainer: {
      position: "relative",
    },
    progress: {
      position: "absolute",
      left: 0,
    },
    progressBackground: {
      color: grey["300"]
    },
  };
});

interface UploadProgressProps {
  size: number;
  uploadOrFile: Upload | FileUpload;
}

const UploadProgress: React.FC<UploadProgressProps> = (props) => {
  const classes = useStyles();
  const { size, uploadOrFile } = props;
  const error = hasError(uploadOrFile)
  return (
    <Fade in={uploadOrFile.progress < 1} timeout={{ enter: 100, exit: 2000 }}>
      <div className={classes.progressContainer}>
        <CircularProgress
          className={classes.progressBackground}
          size={size}
          value={100}
          variant={"static"}
        />
        <CircularProgress
          className={classes.progress}
          size={size}
          value={error ? 0 : uploadOrFile.progress * 100}
          variant={"static"}
        />
      </div>
    </Fade>
  );
};

export default UploadProgress;
