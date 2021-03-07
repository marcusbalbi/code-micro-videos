import Form from "./Form";
import { Page } from "../../components/Page";
import React from "react";
import { useParams } from "react-router";

export const CategoryFormPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page title={!id ? "Criar Categoria" : "Editar Categoria"}>
      <Form />
    </Page>
  );
};

export default CategoryFormPage;
