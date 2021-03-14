import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme';
import Loading from '../components/loading';
import ErrorModal from '../components/errorModal';
import NameForm from '../components/nameForm';

import useRoom from '../utils/hooks/useRoom';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
  },
  cardRoot: {
    maxWidth: 350,
  },
  cardNum: {
    width: '100%',
    height: '100%',
    fontSize: '1.5em',
    lineHeight: '60px',
    borderRadius: '50%',
  },
  unchecked: {
    backgroundColor: '#F2F5F7',
  },
  checked: {
    backgroundColor: '#94d0f7',
  },
}));

interface ParamTypes {
  id: string;
}

const Room: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenNameForm, setIsOpenNameForm] = useState<boolean>(false);
  const { id } = useParams<ParamTypes>();
  const [cardNums, isJoin, isFirstTime, join, error] = useRoom(id);

  const classes = useStyles();

  useEffect(() => {
    if (isJoin) {
      setIsLoading(false);
    }
  }, [isJoin]);

  useEffect(() => {
    if (isFirstTime) {
      setIsOpenNameForm(true);
    }
  }, [isFirstTime]);

  const listItems = () => {
    return cardNums.map((obj) => (
      <GridListTile key={obj.num}>
        <div
          className={`${classes.cardNum} ${
            obj.isChecked ? classes.checked : classes.unchecked
          }`}
        >
          {obj.displayNum}
        </div>
      </GridListTile>
    ));
  };

  const handleNameForm = (name: string) => {
    setIsOpenNameForm(false);
    // ルームに参加
    join(name);
  };

  return (
    <>
      <main>
        <Loading isOpen={isLoading} />
        <ErrorModal isOpen={error.isError} message={error.message} />
        <NameForm open={isOpenNameForm} handleSubmit={handleNameForm} />
        <Box mt={3} className={classes.root}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Card className={classes.cardRoot}>
                <CardHeader
                  title="BINGO CARD"
                  style={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                  }}
                />
                <CardContent>
                  <GridList cols={5} cellHeight={60}>
                    {listItems()}
                  </GridList>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </main>
    </>
  );
};

export default Room;
