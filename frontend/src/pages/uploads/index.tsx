import {
  Card,
  CardContent,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  List,
  Theme,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Upload, UploadModule } from "../../store/uploads/types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Page } from "../../components/Page";
import React from "react";
import UploadItem from "./UploadItem";
import { VideoFileFieldsMap } from "../../util/dto";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme: Theme) => {
  return {
    panelSummary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    expandedIcon: {
      color: theme.palette.primary.contrastText,
    },
  };
});

const UploadPage = () => {
  const classes = useStyles();
  const uploads = useSelector<UploadModule, Upload[]>(
    (state) => state.upload.uploads
  );
  return (
    <Page title="Uploads">
      {uploads.map((upload, key) => {
        return (
          <Card elevation={5} key={key}>
            <CardContent>
              <UploadItem uploadOrFile={upload} >{upload.video.title}</UploadItem>
              <ExpansionPanel style={{ margin: 0 }}>
                <ExpansionPanelSummary
                  className={classes.panelSummary}
                  expandIcon={
                    <ExpandMoreIcon className={classes.expandedIcon} />
                  }
                >
                  <Typography>Ver Detalhes</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: "0px" }}>
                  <Grid item xs={12}>
                    <List dense={true} style={{ padding: "0px" }}>
                      {upload.files.map((file, k) => {
                        return (
                          <React.Fragment key={k}>
                            <Divider />
                            <UploadItem uploadOrFile={file}>
                              {`${VideoFileFieldsMap[file.fileField]} - ${
                                file.filename
                              }`}
                            </UploadItem>
                          </React.Fragment>
                        );
                      })}
                    </List>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </CardContent>
          </Card>
        );
      })}
    </Page>
  );
};

export default UploadPage;
