import Form from "./Form";
import { Page } from "../../components/Page";
import React from "react";
import { useParams } from "react-router";

export const CastMemberFormPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page title={!id ? "Criar Membro" : "Editar Membro"}>
      <Form />
    </Page>
  );
};

export default CastMemberFormPage;
