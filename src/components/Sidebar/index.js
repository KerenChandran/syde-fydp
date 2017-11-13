import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import PersonIcon from 'material-ui-icons/Person';

import NewImport from '../NewImport';

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: 240,
  }
});

const Sidebar = ({ classes }) => {
  return (
    <Drawer
      type="permanent"
      classes={{ paper: classes.drawerPaper }}
    >
      <div style={{
        marginLeft: 20
      }}>
        <NewImport />
      </div>
      <List>
        <ListItem button>
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sidebar);