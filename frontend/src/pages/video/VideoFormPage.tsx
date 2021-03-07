import Form from "./Form/index";
import { Page } from "../../components/Page";
import React from "react";
import { useParams } from "react-router";

export const VideoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page title={!id ? "Criar Video" : "Editar Video"}>
      <Form />
    </Page>
  );
};

export default VideoFormPage;
