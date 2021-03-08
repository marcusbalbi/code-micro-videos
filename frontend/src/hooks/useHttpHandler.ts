import axios from "axios";
import { useCallback } from "react";
import { useSnackbar } from "notistack";

const useHttpHandler = () => {
  const {enqueueSnackbar} = useSnackbar();
  const http = useCallback(
    async (request: Promise<any>) => {
      try {
        const { data } = await request;
        return data;
      } catch (err) {
        console.log(err);
        if (!axios.isCancel(err)) {
          enqueueSnackbar("Não foi possivel carregar as informações", {
            variant: "error",
          });
        }

        throw err;
      }
    },
    [enqueueSnackbar]
  );

  return http;
};

export default useHttpHandler;
