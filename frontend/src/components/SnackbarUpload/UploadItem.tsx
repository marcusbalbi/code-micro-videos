import React from "react";
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

interface UploadItemProps {}

const UploadItem: React.FC<UploadItemProps> = (props) => {
  const classes = useStyles();
  return (
    <>
      <Tooltip title={"Não foi possivel realizar o upload, clique para mais detalhes"} placement="left" >
        <ListItem className={classes.listItem} button>
          <ListItemIcon className={classes.movieIcon}>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.listItemText}
            primary={
              <Typography noWrap={true} variant={"subtitle2"} color={"inherit"}>
                E o Vento Levou!!!
              </Typography>
            }
          />
        </ListItem>
      </Tooltip>
      <Divider component="li" />
    </>
  );
};

export default UploadItem;
