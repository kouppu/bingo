import React, { FC, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { User } from '../models/User';

export interface Props {
  users: User[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      margin: theme.spacing(0.5),
    },
    statusArea: {
      textAlign: 'right',
    },
  })
);

const UsersNavi: FC<Props> = ({ users }) => {
  const classes = useStyles();

  const [isOpenUserList, setIsOpenUserList] = useState<boolean>(false);

  const handleClickUser = (): void => {
    setIsOpenUserList(true);
  };
  const handleCloseUserList = (): void => {
    setIsOpenUserList(false);
  };

  const userlist = () => (
    <List>
      {users.map((user) => {
        return (
          <ListItem>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>{user.name}</ListItemText>
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <>
      <Drawer anchor="left" open={isOpenUserList} onClose={handleCloseUserList}>
        {userlist()}
      </Drawer>

      <Grid container spacing={2}>
        <Grid item xs={3} />
        <Grid item xs={3}>
          <Chip
            label={`参加 ${users.length}`}
            variant="outlined"
            onClick={handleClickUser}
            className={classes.chip}
          />
        </Grid>

        <Grid item xs={3} className={classes.statusArea}>
          {/*
          <Chip
            label="ビンゴ 1"
            variant="outlined"
            // onClick={handleClick}
            className={classes.chip}
          />
          <Chip
            label="リーチ 1"
            variant="outlined"
            // onClick={handleClick}
            className={classes.chip}
          />
          */}
        </Grid>
        <Grid item xs={3} />
      </Grid>
    </>
  );
};

export default UsersNavi;
