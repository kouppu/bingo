import React, { FC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { APP } from '../config';
import { execCopy } from '../utils/common';

export interface Props {
  roomId: string;
  open: boolean;
  handleClose: () => void;
}

const ShareModal: FC<Props> = ({ roomId, open, handleClose }) => {
  const handleCopyButton = (): void => {
    const cardUrl = document.getElementById('cardUrl')?.textContent;
    if (typeof cardUrl !== 'string') return;
    execCopy(cardUrl);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">ビンゴカードURLをコピー</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span id="cardUrl">
            {APP.url}/room/{roomId}
          </span>
          <Button onClick={handleCopyButton}>
            <FileCopyIcon />
          </Button>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
