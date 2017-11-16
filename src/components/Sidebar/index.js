import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import PersonIcon from 'material-ui-icons/Person';
import PeopleIcon from 'material-ui-icons/People';

import NewImport from '../NewImport';

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: 240,
  }
});


const Sidebar = ({ classes, history }) => {
  const navigate = location => () => (
    history.push(`/resources/${location}`)
  );

  return (
    <Drawer
      type="permanent"
      classes={{ paper: classes.drawerPaper }}
    >
      <div style={{ marginLeft: 20, marginBottom: 40, zIndex: 1 }}>
        <NewImport />
      </div>
      <List>
        <ListItem button onClick={navigate('')}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="All Resources" />
        </ListItem>
        <ListItem button onClick={navigate('myresources')}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My Resources" />
        </ListItem>
      </List>
    </Drawer>
  );
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Sidebar));