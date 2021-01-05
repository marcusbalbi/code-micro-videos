import { Box, Fab } from "@material-ui/core";
import React from "react";
import { Page } from "../../components/Page";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Table from "./Table";

export const CategoryListPage = () => {
  return (
    <Page title="Listagem de Categorias">
      <Box dir={"rtl"} paddingBottom={2}>
        <Fab
          color={"secondary"}
          title="Adicionar Categoria"
          size={"small"}
          component={Link}
          to="/categories/create"
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

export default CategoryListPage;
