import React from "react";
import {
  Card,
  CardActions,
  Collapse,
  IconButton,
  List,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/Close";
import { useSnackbar } from "notistack";

interface SnackbarUploadProps {
  id: string | number;
}

const SnackbarUpload = React.forwardRef<any, SnackbarUploadProps>(
  (props, ref) => {
    const { id } = props;
    const { closeSnackbar } = useSnackbar();
    return (
      <Card ref={ref}>
        <CardActions>
          <Typography variant={"subtitle2"}>
            Fazendo Upload de 10 videos
          </Typography>
          <div>
            <IconButton color={"inherit"}>
              <ExpandMoreIcon />
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
        <Collapse>
          <List>Items</List>
        </Collapse>
      </Card>
    );
  }
);

export default SnackbarUpload;
