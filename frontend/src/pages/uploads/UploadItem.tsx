import { FileUpload, Upload } from "../../store/uploads/types";
import {
  Grid,
  ListItem,
  Theme,
  Typography,
  makeStyles,
} from "@material-ui/core";

import ImageIcon from "@material-ui/icons/Image";
import MovieIcon from "@material-ui/icons/Movie";
import React from "react";
import UploadAction from "./UploadAction";
import UploadProgress from "../../components/UploadProgress";

const useStyles = makeStyles((theme: Theme) => {
  return {
    gridTitle: {
      display: "flex",
      color: "#999999",
    },
    icon: {
      color: theme.palette.error.main,
      minWidth: "40px",
    },
  };
});

interface UploadItemProps {
  uploadOrFile: Upload | FileUpload;
}

const UploadItem: React.FC<UploadItemProps> = (props) => {
  const classes = useStyles();
  const { uploadOrFile } = props;
  function makeIcon() {
    if (true) {
      return <MovieIcon className={classes.icon} />;
    }

    return <ImageIcon className={classes.icon} />;
  }
  return (
    <ListItem>
      <Grid container alignItems={"center"}>
        <Grid className={classes.gridTitle} item xs={12} md={9}>
          {makeIcon()}
          <Typography color={"inherit"}>{props.children}</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid
            container
            direction={"row"}
            alignItems={"center"}
            justify={"flex-end"}
          >
            <UploadProgress size={48} uploadOrFile={uploadOrFile} />
            <UploadAction uploadOrFile={uploadOrFile} />
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default UploadItem;
