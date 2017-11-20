import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Popover from 'material-ui/Popover';

import BulkDataImport from '../BulkDataInput';

import { resourceActions, resourceSelectors } from '../../modules/resources';

class NewImport extends Component {
  state = { open: false };

  handleClick = () => {
    this.setState({
      open: true,
      anchorEl: findDOMNode(this.button)
    });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };
  
  handleBulkImport = () => {
    this.props.showBulkImport();
    this.handleRequestClose();
  };

  handleDataImport = () => {
    this.props.showDataImport();
    this.handleRequestClose();
  };

  render() {
    const {
      isBulkImportOpen,
      showBulkImport,
      submitBulkImport
    } = this.props;
    const { anchorEl, open } = this.state;

    return (
      <div>
        <Button
          ref={node => this.button = node}
          raised
          aria-owns={open ? 'menu-list' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          color="primary"
        >
          New
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onRequestClose={this.handleRequestClose}
        >
          <MenuList role="menu">
            <MenuItem onClick={this.handleDataImport}>Data Import</MenuItem>
            <MenuItem onClick={this.handleBulkImport}>Bulk Data Import</MenuItem>
          </MenuList>
        </Popover>
        <BulkDataImport
          open={isBulkImportOpen}
          closeForm={showBulkImport}
          submitForm={submitBulkImport}
        />
      </div>
    );
  }
}

NewImport.defaultProps = {
  isBulkImportOpen: false,
  showBulkImport: () => {},
  showDataImport: () => {}
};

NewImport.propTypes = {
  showBulkImport: PropTypes.func,
  showDataImport: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isBulkImportOpen: resourceSelectors.showBulkImport(state)
})

const mapDispatchToProps = (dispatch) => ({
  showBulkImport: bindActionCreators(resourceActions.toggleBulkImportForm, dispatch),
  showDataImport: bindActionCreators(resourceActions.toggleDataImportForm, dispatch),
  submitBulkImport: bindActionCreators(resourceActions.addBulkImport, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(NewImport);