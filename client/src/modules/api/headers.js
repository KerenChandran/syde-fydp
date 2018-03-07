export default {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + localStorage.getItem('id_token')
};