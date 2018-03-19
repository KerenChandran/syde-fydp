import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

const BASE_URL = 'http://localhost:3000/api/download_file/file/';

const ResourceFileEditList = ({ files, onDelete }) => (
  <div>
    {
      files.map((file, index) => (
        <div key={file.filename}>
          <Button bsStyle="danger" onClick={onDelete(index)}>
            <Glyphicon glyph="times" />
          </Button>
          <a href={BASE_URL + file.filename}>{file.original_filename}</a>
        </div>
      ))
    }
  </div>
);

export default ResourceFileEditList;