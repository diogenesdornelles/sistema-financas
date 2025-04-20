import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { JSX } from "react";
import React from "react";

interface ExcludeDialogProps {
  open: boolean;
  itemId: string;
  onClose: () => void;
  onConfirmDelete: () => Promise<void> | void;
}

export default function ExcludeDialog({ open, itemId, onClose, onConfirmDelete }: ExcludeDialogProps): JSX.Element {

  const handleConfirm = async () => {
    await onConfirmDelete();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar exclusão"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirme a exclusão do recurso (Item ID: {itemId})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Manter</Button>
          <Button
            onClick={handleConfirm}
            autoFocus
            color="error"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}