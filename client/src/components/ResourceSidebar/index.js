import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import { searchActions } from '../../modules/search';
import { resourceActions, resourceSelectors } from '../../modules/resources';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';

import { DropdownButton, MenuItem, ListGroup, ListGroupItem } from 'react-bootstrap';

import BulkDataImport from '../BulkDataInput';
import './index.css';

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: 225,
  }
});

class Sidebar extends Component {
  navigate = location => () => {
    const { history, resetSearch } = this.props;
    resetSearch();
    history.push(`/resources/${location}`);
  }

  handleDataImport = () => {
    this.props.history.push('/resources/new');
  }

  handleBulkImport = () => {
    this.props.showBulkImport();
  };

  activeLink = () => {
    const { match } = this.props;
  }

  render() {
    const {
      classes,
      isBulkImportOpen,
      showBulkImport,
      submitBulkImport
    } = this.props;
    return (
      <div className="resources-sidebar-root">
        <DropdownButton noCaret bsClass="new-resource-btn dropdown" bsStyle="primary" title="New">
          <MenuItem eventKey="1" onSelect={this.handleDataImport}>Individual Resource</MenuItem>
          <MenuItem eventKey="2" onSelect={this.handleBulkImport}>Bulk Resources</MenuItem>
        </DropdownButton>
        <Drawer
          type="permanent"
          classes={{ paper: classes.drawerPaper }}
        > 
        <ListGroup>
          <NavLink to="/resources" exact className="resource-link" activeClassName="active-link">
            <ListGroupItem>All Resources</ListGroupItem>
          </NavLink>
          <NavLink to="/resources/myresources" exact className="resource-link" activeClassName="active-link">
            <ListGroupItem>My Resources</ListGroupItem>
          </NavLink>
          </ListGroup>

          <BulkDataImport
            open={isBulkImportOpen}
            closeForm={showBulkImport}
            submitForm={submitBulkImport}
          />
        </Drawer>
      </div>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

Sidebar.defaultProps = {
  resetSearch: () => {}
};

const mapStateToProps = (state) => ({
  isBulkImportOpen: resourceSelectors.showBulkImport(state)
});

const mapDispatchToProps = dispatch => ({
  resetSearch: bindActionCreators(searchActions.resetSearch, dispatch),
  showBulkImport: bindActionCreators(resourceActions.toggleBulkImportForm, dispatch),
  submitBulkImport: bindActionCreators(resourceActions.addBulkImport, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Sidebar)));