import React, { FC, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export interface Props {
  open: boolean;
  handleSubmit: (userName: string) => void;
}

const NameForm: FC<Props> = ({ open, handleSubmit }) => {
  const [userName, setUserName] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const maxLen = 20;

  const handleChange = (value: string): void => {
    setUserName(value);
  };

  const handleBotton = (): void => {
    if (userName === '') {
      setIsError(true);
      setErrorMessage('入力してください');

      return;
    }
    if (userName.length > maxLen) {
      setIsError(true);
      setErrorMessage(`${maxLen}文字以内で入力してください`);

      return;
    }

    setIsError(false);
    setErrorMessage('');
    handleSubmit(userName);
  };

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">名前を入力してください</DialogTitle>
      <DialogContent>
        <form noValidate autoComplete="off">
          <TextField
            margin="dense"
            id="nameInput"
            label="名前"
            fullWidth
            value={userName}
            error={isError}
            helperText={errorMessage}
            onChange={(e) => handleChange(e.target.value)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBotton} color="primary">
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NameForm;
