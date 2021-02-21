import { Box, Fab } from "@material-ui/core";
import React from "react";
import { Page } from "../../components/Page";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Table from "./Table";

export const VideoListPage = () => {
  return (
    <Page title="Listagem de Videos">
      <Box dir={"rtl"} paddingBottom={2}>
        <Fab
          color={"secondary"}
          title="Adicionar Video"
          size={"small"}
          component={Link}
          to="/videos/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <Table />
      </Box>
    </Page>
  );
};

export default VideoListPage;
