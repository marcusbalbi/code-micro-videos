import Form from "./Form";
import { Page } from "../../components/Page";
import React from "react";
import { useParams } from "react-router";

export const GenreFormPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page title={!id ? "Criar Gênero" : "Editar Gênero"}>
      <Form />
    </Page>
  );
};

export default GenreFormPage;
