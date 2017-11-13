import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import PersonIcon from 'material-ui-icons/Person';
import MoodIcon from 'material-ui-icons/Mood';
import MoodBadIcon from 'material-ui-icons/MoodBad';

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
      <div style={{ marginLeft: 20, marginBottom: 40, zIndex: 1 }}>
        <NewImport />
      </div>
      <List>
        <ListItem button>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My Resources" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <MoodIcon />
          </ListItemIcon>
          <ListItemText primary="Available" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <MoodBadIcon />
          </ListItemIcon>
          <ListItemText primary="Not Available" />
        </ListItem>
      </List>
    </Drawer>
  );
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sidebar);