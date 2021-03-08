import { useEffect } from "react";
import { useSnackbar } from "notistack";

const useSnackbarFromError = (submitCount, errors) => {
  const {enqueueSnackbar} = useSnackbar();
  useEffect(() => {
    const hasErrors = Object.keys(errors).length !== 0;
    if (submitCount > 0 && hasErrors) {
      enqueueSnackbar(
        "Formulário inválido, Reveja os campos marcados de vermelho.",
        { variant: "error" }
      );
    }
  }, [submitCount, errors, enqueueSnackbar]);
};

export default useSnackbarFromError;
