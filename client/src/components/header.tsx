import React, { FC } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const Header: FC = () => {
  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">BINGO</Typography>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
