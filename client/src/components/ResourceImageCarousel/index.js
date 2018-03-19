import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';

const BASE_URL = 'http://localhost:3000/api/download_file/image/';

const ResourceImageCarousel = ({ images }) => (
  <Carousel>
    {
      images.map(image => (
        <img className="center-block" key={image.filename} src={BASE_URL + image.filename} />
      ))
    }
  </Carousel>
);

export default ResourceImageCarousel;