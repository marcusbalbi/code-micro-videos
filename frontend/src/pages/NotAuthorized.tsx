import {
  Box,
  Container,
  Theme,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Link } from "react-router-dom";
import React from "react";

const useStyles = makeStyles((theme: Theme) => {
  return {
    paragraph: {
      display: "flex",
      margin: theme.spacing(2),
      alignItems: "center",
    },
  };
});

export const NotAuthorized: React.FC = (props) => {
  const classes = useStyles();
  return (
    <Container>
      <Typography variant="h4" component="h1">
        403 - Não Autorizado
      </Typography>

      <Box className={classes.paragraph}>
        <ExitToAppIcon />

        <Typography>
          Acess o codeflix pelo <Link to={"/"}>endereço</Link>
        </Typography>
      </Box>
    </Container>
  );
};
