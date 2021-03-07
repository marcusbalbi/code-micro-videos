import React, { useState } from "react";
import {
  Card,
  CardActions,
  Collapse,
  IconButton,
  List,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import CloseIcon from "@material-ui/icons/Close";
import { useSnackbar } from "notistack";
import UploadItem from "./UploadItem";
import { Upload, UploadModule } from "../../store/uploads/types";
import { countInProgress } from "../../store/uploads/getters";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme: Theme) => {
  return {
    card: {
      width: 450,
    },
    cardActionRoot: {
      padding: "8px 8px 8px 16px",
      backgroundColor: theme.palette.primary.main,
    },
    title: {
      fontWeight: "bold",
      color: theme.palette.primary.contrastText,
    },
    icons: {
      marginLeft: "auto !important",
      color: theme.palette.primary.contrastText,
    },
    list: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  };
});

interface SnackbarUploadProps {
  id: string | number;
}

const SnackbarUpload = React.forwardRef<any, SnackbarUploadProps>(
  (props, ref) => {
    const { id } = props;
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(true);
    const classes = useStyles({ expanded });

    const uploads = useSelector<UploadModule, Upload[]>(
      (state) => state.upload.uploads
    );

    const countUploadsInProgress = countInProgress(uploads);

    const dispatch = useDispatch();

    return (
      <Card ref={ref} className={classes.card}>
        <CardActions classes={{ root: classes.cardActionRoot }}>
          <Typography variant={"subtitle2"} className={classes.title}>
            Fazendo Upload de {countUploadsInProgress} videos
          </Typography>
          <div className={classes.icons}>
            <IconButton
              color={"inherit"}
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
            <IconButton
              onClick={() => {
                closeSnackbar(id);
              }}
              color={"inherit"}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded}>
          <List className={classes.list}>
            {uploads.map((upload, key) => {
              return <UploadItem key={key} upload={upload} />;
            })}
          </List>
        </Collapse>
      </Card>
    );
  }
);

export default SnackbarUpload;
