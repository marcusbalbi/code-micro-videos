import React from "react";
import { useParams } from "react-router";
import { Page } from "../../components/Page";
import Form from "./Form";

export const CategoryFormPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page title={!id ? "Criar Categoria" : "Editar Categoria"}>
      <Form />
    </Page>
  );
};

export default CategoryFormPage;
