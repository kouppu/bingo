import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/core/styles';

import { ResultNums } from '../utils/types';

const useStyles = makeStyles(() => ({
  resultContainer: {
    textAlign: 'center',
    width: '900px',
  },
  resultNum: {
    width: '100%',
    height: '100%',
    fontSize: '1.5em',
    lineHeight: '50px',
  },
  unchecked: {
    backgroundColor: '#F2F5F7',
  },
  checked: {
    backgroundColor: '#94d0f7',
  },
}));

export interface ResultListProps {
  resultNums: ResultNums[];
}

const ResultList: FC<ResultListProps> = ({ resultNums }) => {
  const classes = useStyles();

  const listItems = resultNums.map((resultObj) => (
    <GridListTile key={resultObj.num}>
      <div
        className={`${classes.resultNum} ${
          resultObj.isChecked ? classes.checked : classes.unchecked
        }`}
      >
        {resultObj.displayNum}
      </div>
    </GridListTile>
  ));

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Box mt={4} className={classes.resultContainer}>
        <Card>
          <CardContent>
            <GridList cols={15} cellHeight={50}>
              {listItems}
            </GridList>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
};

export default ResultList;
