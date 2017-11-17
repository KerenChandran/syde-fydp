import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import DetailsIcon from 'material-ui-icons/Details';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 600
  },
});

class MyResources extends Component {
  handleDetails = id => () => {
    this.props.showDetailsForm(id);
  }

  handleEdit = id => () => {
    this.props.showEditForm(id);
  }

  handleClose = () => {
    this.props.toggleEditForm();
  }

  handleDelete = id => () => {
    this.props.deleteResource(id);
  }

  render() {
    const { classes, currentUserId, resources } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding='dense'>Category</TableCell>
              <TableCell padding='dense'>Company</TableCell>
              <TableCell padding='dense'>Model</TableCell>
              <TableCell padding='dense'>Location</TableCell>
              <TableCell padding='dense'>Incentive</TableCell>
              <TableCell padding='dense'>Fees</TableCell>
              <TableCell padding='dense'>Avaialble</TableCell>
              <TableCell padding='none'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map(resource => {
              const fees = resource.fine !== null ? `$${resource.fine.toFixed(2)}` : resource.fine;
              return (
                <TableRow key={resource.id}>
                  <TableCell padding='dense'>{resource.category}</TableCell>
                  <TableCell padding='dense'>{resource.company}</TableCell>
                  <TableCell padding='dense'>{resource.model}</TableCell>
                  <TableCell padding='dense'>{resource.location}</TableCell>
                  <TableCell padding='dense'>{resource.incentive}</TableCell>
                  <TableCell padding='dense'>{fees}</TableCell>
                  <TableCell padding='dense'>{resource.available ? 'Yes' : 'No'}</TableCell>
                  { resource.ownerId === currentUserId ?
                    <TableCell padding='none'>
                      <IconButton className={classes.button} aria-label="Edit" onClick={this.handleEdit(resource.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton className={classes.button} aria-label="Delete" onClick={this.handleDelete(resource.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell> : 
                    <TableCell padding='none'>
                      <IconButton className={classes.button} aria-label="Details" onClick={this.handleDetails(resource.id)}>
                        <DetailsIcon />
                      </IconButton>
                    </TableCell>
                  }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

MyResources.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyResources);