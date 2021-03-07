import {
  Card,
  CardContent,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  List,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useMemo } from "react";
import { Page } from "../../components/Page";
import UploadItem from "./UploadItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { Upload, UploadModule } from "../../store/uploads/types";
import { VideoFileFieldsMap } from "../../util/dto";
import { Creators } from "../../store/uploads";

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
  const dispatch = useDispatch();
  useMemo(() => {
    setTimeout(() => {
      const obj: any = {
        video: {
          id: "7e12b869-628c-47ec-af86-2b47ecaf2df4",
          title: "e o vento levou",
        },
        files: [
          { file: new File([""], "teste.mp4"), fileField: "trailer_file" },
          { file: new File([""], "teste.mp4"), fileField: "video_file" },
        ],
      };
      dispatch(Creators.addUpload(obj));
      const progress1 = {
        fileField: "trailer_file",
        progress: 10,
        video: { id: 1 },
      } as any;
      dispatch(Creators.updateProgress(progress1));
      const progress2 = {
        fileField: "video_file",
        progress: 20,
        video: { id: 1 },
      } as any;
      dispatch(Creators.updateProgress(progress2));
    }, 1000);
    //eslint-disable-next-line
  }, []);
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
