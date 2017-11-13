import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700
  },
});

class MyResources extends Component {
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
    const { classes, resources } = this.props;
    let id = -1;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Incentive</TableCell>
              <TableCell>Avaialble</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map(resource => {
              id++;
              return (
                <TableRow key={id}>
                  <TableCell>{resource["Model"]} {resource["Category"]}</TableCell>
                  <TableCell>{resource["location"]}</TableCell>
                  <TableCell>{resource["incentive"]}</TableCell>
                  <TableCell>{resource["available"] ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton className={classes.button} aria-label="Edit" onClick={this.handleEdit(id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton className={classes.button} aria-label="Delete" onClick={this.handleDelete(id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
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