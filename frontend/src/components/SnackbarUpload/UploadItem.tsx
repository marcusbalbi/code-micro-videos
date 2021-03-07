import React, { useState } from "react";
import MovieIcon from "@material-ui/icons/Movie";
import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import UploadProgress from "../UploadProgress";
import UploadAction from "./UploadAction";
import { Upload } from "../../store/uploads/types";
import { hasError } from "../../store/uploads/getters";

const useStyles = makeStyles((theme: Theme) => {
  return {
    movieIcon: {
      color: theme.palette.error.main,
      minWidth: "40px",
    },
    listItem: {
      paddingTop: "7px",
      paddingBottom: "7px",
      height: "53px",
    },
    listItemText: {
      marginLeft: "6px",
      marginRight: "24px",
      color: theme.palette.text.secondary,
    },
  };
});

interface UploadItemProps {
  upload: Upload;
}

const UploadItem: React.FC<UploadItemProps> = (props) => {
  const classes = useStyles();
  const { upload } = props;
  const error = hasError(upload);
  const [itemHover, setItemHover] = useState(false);
  return (
    <>
      <Tooltip
        disableFocusListener
        disableTouchListener
        title={
          error
            ? "Não foi Possivel fazer o upload, clique para mais detalhes"
            : ""
        }
        placement="left"
      >
        <ListItem
          onMouseOver={() => {
            setItemHover(true);
          }}
          onMouseLeave={() => {
            setItemHover(false);
          }}
          className={classes.listItem}
          button
        >
          <ListItemIcon className={classes.movieIcon}>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.listItemText}
            primary={
              <Typography noWrap={true} variant={"subtitle2"} color={"inherit"}>
                {`${upload.video.title}`}
              </Typography>
            }
          />
          <UploadProgress size={30} uploadOrFile={upload} />
          <UploadAction upload={upload} hover={itemHover} />
        </ListItem>
      </Tooltip>
      <Divider component="li" />
    </>
  );
};

export default UploadItem;
