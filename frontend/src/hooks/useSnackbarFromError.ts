import { useSnackbar } from "notistack";
import { useEffect } from "react";

const useSnackbarFromError = (submitCount, errors) => {
  const snackbar = useSnackbar();
  useEffect(() => {
    const hasErrors = Object.keys(errors).length !== 0;
    if (submitCount > 0 && hasErrors) {
      snackbar.enqueueSnackbar(
        "Formulário inválido, Reveja os campos marcados de vermelho.",
        { variant: "error" }
      );
    }
    //eslint-disable-next-line
  }, [submitCount]);
};

export default useSnackbarFromError;
