import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

const BASE_URL = 'http://localhost:3000/api/download_file/file/';

const ResourceFileEditList = ({ files, onDelete }) => (
  <div>
    {
      files.map((file, index) => (
        <div key={index}>
          <Button bsStyle="danger" onClick={onDelete(index)}>X</Button>
          <span style={{ marginLeft: 10 }}>{file.original_filename}</span>
        </div>
      ))
    }
  </div>
);

export default ResourceFileEditList;