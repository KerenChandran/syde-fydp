import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { searchActions } from '../../modules/search';

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
    width: 225,
  }
});

class Sidebar extends Component {
  navigate = location => () => {
    const { history, resetSearch } = this.props;
    resetSearch();
    history.push(`/resources/${location}`);
  }

  render() {
    const { classes } = this.props;
    return (
      <Drawer
        type="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <div style={{ marginLeft: 20, marginBottom: 40, zIndex: 1 }}>
          <NewImport />
        </div>
        <List>
          <ListItem button onClick={this.navigate('')}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="All Resources" />
          </ListItem>
          <ListItem button onClick={this.navigate('myresources')}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="My Resources" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

Sidebar.defaultProps = {
  resetSearch: () => {}
};

const mapDispatchToProps = dispatch => ({
  resetSearch: bindActionCreators(searchActions.resetSearch, dispatch)
});

export default connect(null, mapDispatchToProps)(withRouter(withStyles(styles)(Sidebar)));