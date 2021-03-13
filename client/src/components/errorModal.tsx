import React, { FC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface Props {
  message: string;
  isOpen: boolean;
}

const ErrorModal: FC<Props> = ({ message, isOpen }) => {
  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{message}</DialogTitle>
    </Dialog>
  );
};

export default ErrorModal;
