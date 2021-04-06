import * as React from "react";
import { Container, Typography } from "@material-ui/core";

interface WaitingProps {}

const Waiting: React.FC<WaitingProps> = (props) => {
  return <Container>
    <Typography>Aguarde...</Typography>
  </Container>;
};

export default Waiting;
