import React from "react";
import { useParams } from "react-router";
import { Page } from "../../components/Page";
import Form from "./Form";

export const CastMemberFormPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page title={!id ? "Criar Membro" : "Editar Membro"}>
      <Form />
    </Page>
  );
};

export default CastMemberFormPage;
