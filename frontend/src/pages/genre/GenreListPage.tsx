import { Box, Fab } from "@material-ui/core";
import React from "react";
import { Page } from "../../components/Page";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Table from "./Table";

export const GenreList = () => {
  return (
    <Page title="Listagem de Gêneros">
      <Box dir={"rtl"}>
        <Fab
          title="Adicionar Gênero"
          size={"small"}
          component={Link}
          to="/genres/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <Table></Table>
      </Box>
    </Page>
  );
};
