import { useSnackbar } from "notistack";
import axios from "axios";

const useHttpHandler = () => {
  const snackbar = useSnackbar();
  return async (request: Promise<any>) => {
    try {
      const { data } = await request;
      return data;
    } catch (err) {
      console.log(err);
      if (!axios.isCancel(err)) {
        snackbar.enqueueSnackbar("Não foi possivel carregar as informações", {
          variant: "error",
        });
      }
      
      throw err;
    }
  };
};

export default useHttpHandler;
