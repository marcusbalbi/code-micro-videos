import "./App.css";
import "./util/vendor/yup";
import { Box, CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { AppRouter } from "./routes/AppRouter";
import Breadcrumbs from "./components/Breadcrumbs";
import { BrowserRouter } from "react-router-dom";
import LoadingProvider from "./components/loading/LoadingProvider";
import { Navbar } from "./components/Navbar";
import React from "react";
import { SnackbarProvider } from "./components/SnackbarProvider";
import Spinner from "./components/Spinner";
import theme from "./theme";
function App() {
  return (
    <React.Fragment>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <BrowserRouter basename="/admin" >
              <Spinner />
              <Navbar />
              <Box paddingTop={"70px"}>
                <Breadcrumbs />
                <AppRouter />
              </Box>
            </BrowserRouter>
          </SnackbarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
  );
}

export default App;
