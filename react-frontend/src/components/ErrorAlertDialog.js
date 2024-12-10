import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import '../styles/AlertDialog.css';

const ErrorAlertDialog = ({ isOpen, onClose, errorMessage }) => {
  console.log('ErrorAlertDialog rendered', { isOpen, errorMessage });

  return (
    <AlertDialog.Root open={isOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="alert-dialog-overlay" />
        <AlertDialog.Content className="alert-dialog-content">
          <AlertDialog.Title className="alert-dialog-title">Error</AlertDialog.Title>
          <AlertDialog.Description className="alert-dialog-description">
            {errorMessage}
          </AlertDialog.Description>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 25 }}>
            <AlertDialog.Action asChild>
              <button className="alert-dialog-button" onClick={onClose}>
                OK
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ErrorAlertDialog;