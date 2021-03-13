import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'block',
    width: '100%',
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 1000,
    textAlign: 'center',
  },
}));

const Footer: FC = () => {
  const classes = useStyles();

  return (
    <footer>
      <Box className={classes.wrapper}>
        <Typography variant="caption">
          Copyright © 2021 {window.location.hostname}
        </Typography>
      </Box>
    </footer>
  );
};

export default Footer;
