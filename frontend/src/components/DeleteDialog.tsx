import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";

interface DeleteDialogProps {
  open: boolean;
  handleClose: (confirmed: boolean) => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
  const { open, handleClose } = props;

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Exclusão de Registros</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja Realmente excluir este(s) registro(s)
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color={"primary"}>
          Cancelar
        </Button>
        <Button onClick={() => handleClose(true)} color={"primary"} autoFocus>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
