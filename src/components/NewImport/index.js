import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';

import BulkDataImport from '../BulkDataInput';
import DataImport from '../DataInput';

import { resourceActions, resourceSelectors } from '../../modules/resources';

class NewImport extends Component {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState({ open: true });
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
    const { open } = this.state;

    return (
      <div>
        <Manager>
          <Target>
            <Button
              raised
              aria-owns={open ? 'menu-list' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
              color="primary"
            >
              New
            </Button>
          </Target>
          <Popper placement="bottom-start" eventsEnabled={open}>
            <ClickAwayListener onClickAway={this.handleRequestClose}>
              <Grow in={open} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper>
                  <MenuList role="menu">
                    <MenuItem onClick={this.handleDataImport}>Data Import</MenuItem>
                    <MenuItem onClick={this.handleBulkImport}>Bulk Data Import</MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
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