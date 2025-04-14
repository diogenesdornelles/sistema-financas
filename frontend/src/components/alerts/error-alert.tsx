import { Alert, AlertTitle, Box } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { JSX } from "react";

interface ErrorAlertProps {
  title?: string;
  message: string;
  details?: string;
}

export default function ErrorAlert({ title = "Erro", message, details }: ErrorAlertProps): JSX.Element {
  return (
    <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error">
      <AlertTitle>{title}</AlertTitle>
      {message}
      {details && (
        <Box component="div" sx={{ marginTop: 1, fontSize: "0.875rem", color: "rgba(0, 0, 0, 0.6)" }}>
          {details}
        </Box>
      )}
    </Alert>
  );
}