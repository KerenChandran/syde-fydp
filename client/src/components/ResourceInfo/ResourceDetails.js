import React from 'react';

import Grid from 'material-ui/Grid';
import Subheader from 'material-ui/List/ListSubheader';

const ResourceDetails = props => {
  const {
    category,
    company,
    faculty,
    location,
    model,
    mobile,
    available,
    description,
    rules,
    application,
    incentive,
    fine
  } = props;
  return (
    <Grid container alignContent="center" alignItems="center">
      <Grid item xs={3}>
        <Subheader>Category</Subheader>
      </Grid>
      <Grid item xs={9}>{category}</Grid>
      <Grid item xs={3}>
        <Subheader>Company</Subheader>
      </Grid>
      <Grid item xs={9}>{company}</Grid>
      <Grid item xs={3}>
        <Subheader>Model</Subheader>
      </Grid>
      <Grid item xs={9}>{model}</Grid>
      <Grid item xs={3}>
        <Subheader>Faculty</Subheader>
      </Grid>
      <Grid item xs={3}>{faculty}</Grid>
      <Grid item xs={3}>
        <Subheader>Location</Subheader>
      </Grid>
      <Grid item xs={3}>{location}</Grid>
      <Grid item xs={3}>
        <Subheader>Incentive Type</Subheader>
      </Grid>
      <Grid item xs={3}>{incentive}</Grid>
      { incentive === 'User Fees' ?
        <div style={{ display: 'flex', alignContent: "center", alignItems: "center", flex: '1 1 0', flexBasis: '50%'}}>
          <Grid item xs={6}>
            <Subheader>
              <div style={{ padding: 8 }}>User Fees</div>
            </Subheader>
          </Grid>
          <Grid item xs={6}>
            <div style={{ alignContent: "center", alignItems: "center", padding: 8 }}>${fine.toFixed(2)}</div>
          </Grid>
        </div> : <Grid item xs={6} />
      }
      <Grid item xs={3}>
        <Subheader>Mobile</Subheader>
      </Grid>
      <Grid item xs={3}>{mobile ? 'Yes' : 'No'}</Grid>
      <Grid item xs={3}>
        <Subheader>Available</Subheader>
      </Grid>
      <Grid item xs={3}>{available ? 'Yes' : 'No'}</Grid>
      <Grid item xs={12}>
        <Subheader>Description</Subheader>
      </Grid>
      <Grid item xs={12}>{description}</Grid>
      <Grid item xs={12}>
        <Subheader>Rules & Restrictions</Subheader>
      </Grid>
      <Grid item xs={12}>{rules}</Grid>
      <Grid item xs={12}>
        <Subheader>Application</Subheader>
      </Grid>
      <Grid item xs={12}>{application}</Grid>
    </Grid>
  );
}

export default ResourceDetails;