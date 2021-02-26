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
import React from "react";
import { Page } from "../../components/Page";
import UploadItem from "./UploadItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  return (
    <Page title="Uploads">
      <Card elevation={5}>
        <CardContent>
          <UploadItem>Video - E o vento levou!</UploadItem>
          <ExpansionPanel style={{ margin: 0 }}>
            <ExpansionPanelSummary
              className={classes.panelSummary}
              expandIcon={<ExpandMoreIcon className={classes.expandedIcon} />}
            >
              <Typography>Ver Detalhes</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ padding: "0px" }}>
              <Grid item xs={12}>
                <List dense={true} style={{ padding: "0px" }}>
                  <Divider />
                  <UploadItem> Principal - Nome do Arquivo</UploadItem>
                </List>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </CardContent>
      </Card>
    </Page>
  );
};

export default UploadPage;
