import React, { JSX } from 'react';
import { Alert, Snackbar, AlertTitle, Box } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface ToastAlertProps {
  title: string;
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  details?: string;
  icon?: JSX.Element;
  open: boolean;
  handleClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

export default function ToastAlert({ severity, title, message, details, icon, open, handleClose }: ToastAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ marginTop: '120px' }}
    >
      <Alert
        onClose={handleClose || (() => {})}
        severity={severity || 'error'}
        icon={icon || <ErrorIcon fontSize="inherit" />}
        sx={{ width: '100%' }}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
        {details && (
          <Box component="div" sx={{ marginTop: 1, fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>
            {details}
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
}
