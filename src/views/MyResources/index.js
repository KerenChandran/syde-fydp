import React from 'react';
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

const MyResources = ({ classes, resources, onEditClick, onDeleteClick }) => {
  let id = 0;
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
            return (
              <TableRow key={id++}>
                <TableCell>{resource["Model"]} {resource["Category"]}</TableCell>
                <TableCell>{resource["location"]}</TableCell>
                <TableCell>{resource["incentive"]}</TableCell>
                <TableCell>{resource["available"] ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton className={classes.button} aria-label="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton className={classes.button} aria-label="Delete">
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
};

MyResources.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyResources);