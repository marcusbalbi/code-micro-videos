import React from "react";
import { useParams } from "react-router";
import { Page } from "../../components/Page";
import Form from "./Form/index";

export const VideoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page title={!id ? "Criar Video" : "Editar Video"}>
      <Form />
    </Page>
  );
};

export default VideoFormPage;
