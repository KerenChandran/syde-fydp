import React from 'react';

const BASE_URL = 'http://localhost:3000/api/download_file/file/';

const ResourceFileList = ({ files }) => (
  <div>
    {
      files.map(file => (
        <a key={file.filename} href={BASE_URL + file.filename}>{file.original_filename}</a>
      ))
    }
  </div>
);

export default ResourceFileList;