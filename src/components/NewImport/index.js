import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Popover from 'material-ui/Popover';

import BulkDataImport from '../BulkDataInput';
import DataImport from '../DataInput';

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
      isDataImportOpen,
      showBulkImport,
      showDataImport,
      submitBulkImport,
      submitDataImport
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
        <DataImport
          open={isDataImportOpen}
          closeForm={showDataImport}
          submitForm={submitDataImport}
        />
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
  isDataImportOpen: false,
  showBulkImport: () => {},
  showDataImport: () => {}
};

NewImport.propTypes = {
  showBulkImport: PropTypes.func,
  showDataImport: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isBulkImportOpen: resourceSelectors.showBulkImport(state),
  isDataImportOpen: resourceSelectors.showDataImport(state)
})

const mapDispatchToProps = (dispatch) => ({
  showBulkImport: bindActionCreators(resourceActions.toggleBulkImportForm, dispatch),
  showDataImport: bindActionCreators(resourceActions.toggleDataImportForm, dispatch),
  submitBulkImport: bindActionCreators(resourceActions.addBulkImport, dispatch),
  submitDataImport: bindActionCreators(resourceActions.addDataImport, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(NewImport);