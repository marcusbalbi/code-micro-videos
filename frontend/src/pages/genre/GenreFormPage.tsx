import React from "react";
import { useParams } from "react-router";
import { Page } from "../../components/Page";
import Form from "./Form";

export const GenreFormPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page title={!id ? "Criar Gênero" : "Editar Gênero"}>
      <Form />
    </Page>
  );
};

export default GenreFormPage;
