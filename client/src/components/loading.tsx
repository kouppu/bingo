import React, { FC } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      opacity: 0.1,
    },
  })
);

export interface Props {
  isOpen: boolean;
}

const Loading: FC<Props> = ({ isOpen }) => {
  const classes = useStyles();

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <CircularProgress />
      </DialogContent>
    </Dialog>
  );
};

export default Loading;
