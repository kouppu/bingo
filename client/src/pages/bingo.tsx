import React, { FC, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import UsersNavi from '../components/usersNavi';
import ResultList from '../components/resultList';
import Loading from '../components/loading';
import ShareModal from '../components/shareModal';
import ErrorModal from '../components/errorModal';

import useBingo from '../utils/hooks/useBingo';

const useStyles = makeStyles(() => ({
  number: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'skyblue',
    textAlign: 'center',
    lineHeight: '200px',
    fontSize: '8em',
  },
  actionButton: {
    width: '80px',
  },
}));

const Bingo: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenShareModal, setIsOpenShareModal] = useState<boolean>(true);
  const [
    displayNum,
    resultNums,
    roomId,
    users,
    isJoin,
    isEnd,
    isPlay,
    spin,
    stop,
    error,
  ] = useBingo();

  const classes = useStyles();

  useEffect(() => {
    if (isJoin) {
      setIsLoading(false);
    }
  }, [isJoin]);

  /** シェアモーダル */
  const handleShareModalClose = () => {
    setIsOpenShareModal(false);
  };
  const handleShareModalOpen = () => {
    setIsOpenShareModal(true);
  };

  const actionButton = (): JSX.Element => {
    if (isEnd) {
      return (
        <Button className={classes.actionButton} variant="contained">
          END
        </Button>
      );
    }
    if (!isPlay) {
      return (
        <Button
          className={classes.actionButton}
          variant="contained"
          color="primary"
          onClick={spin}
        >
          SPIN
        </Button>
      );
    }

    return (
      <Button
        className={classes.actionButton}
        variant="contained"
        color="secondary"
        onClick={stop}
      >
        STOP
      </Button>
    );
  };

  return (
    <>
      <Box mt={3}>
        <Loading isOpen={isLoading} />
        <ErrorModal isOpen={error.isError} message={error.message} />
        <ShareModal
          roomId={roomId}
          open={isOpenShareModal}
          handleClose={handleShareModalClose}
        />

        <Grid container justify="center">
          <UsersNavi users={users} />

          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <div className={classes.number}>{displayNum}</div>
            </Grid>
            <Grid item xs={12}>
              <Box mt={1}>
                <Box mt={1}>{actionButton}</Box>
                <Box mt={1}>
                  <Button
                    className={classes.actionButton}
                    variant="contained"
                    onClick={handleShareModalOpen}
                  >
                    SHARE
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <ResultList resultNums={resultNums} />
        </Grid>
      </Box>
    </>
  );
};

export default Bingo;
