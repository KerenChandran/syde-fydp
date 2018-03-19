import React from 'react';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import ScheduleFilters from '../../containers/ScheduleFilters';

import './index.css';

const LIST = 'list';
const MAP = 'map';
const GRID = 'grid';

export default ({ view, handleViewToggle }) => (
  <div className="resource-data-header-container">
    <Button bsStyle={view === LIST ? 'primary' : 'default'} onClick={handleViewToggle(LIST)}>
      <Glyphicon glyph="list" />
    </Button>
    <Button bsStyle={view === MAP ? 'primary' : 'default'} onClick={handleViewToggle(MAP)}>
      <Glyphicon glyph="map-marker" />
    </Button>
    <Button bsStyle={view === GRID ? 'primary' : 'default'} onClick={handleViewToggle(GRID)}>
      <Glyphicon glyph="map-marker" />
    </Button>
  </div>
)