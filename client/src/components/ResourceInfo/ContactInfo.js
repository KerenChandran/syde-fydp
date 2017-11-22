import React from 'react';

import Grid from 'material-ui/Grid';
import Subheader from 'material-ui/List/ListSubheader';

const ContactInfo = ({ name, email, phone, emailPreferred, phonePreferred }) => (
  <Grid container xs={12} alignItems="center" alignContent="center">
    <Grid item xs={6}>
      <Subheader>Owner Name</Subheader>
    </Grid>
    <Grid item xs={6}>{name}</Grid>
    <Grid item xs={6}>
      <Subheader>Email {emailPreferred ? '(Preferred)' : null}</Subheader>
    </Grid>
    <Grid item xs={6}>{email}</Grid>
    <Grid item xs={6}>
      <Subheader>Phone {phonePreferred ? '(Preferred)' : null}</Subheader>
    </Grid>
    <Grid item xs={6}>{phone}</Grid>
  </Grid>
);

export default ContactInfo;