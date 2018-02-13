import React, { Component } from 'react';
import {
  FormControl,
  FormGroup,
  InputGroup,
  DropdownButton,
  MenuItem,
  Glyphicon,
  Button,
  Panel
} from 'react-bootstrap';

import './index.css';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      searchText: '',
      ...props.filters
    };
  }

  toggleFilters = () => {
    this.setState({ open: !this.state.open });
  }

  handleChange = name => event => (
    this.setState({ [name]: event.target.value })
  )
  
  handleSubmit = () => {
    const { open, ...search } = this.state;
    this.props.submitSearch(search);
  }

  handleReset = () => {
    const { open, ...filters } = this.state;
    const newState = {};

    Object.keys(filters).forEach(key => newState[key] = '');
    this.setState(newState);
  }

  render() {
    const { open, ...filters } = this.state;

    return (
      <div className="search-root">
        <div className="search-container">
          <Button bsStyle="link" className="search-btn" onClick={this.handleSubmit}>
            <Glyphicon glyph="search"/>
          </Button>
          <div className="search-box">
            <FormGroup>
              <InputGroup>
                <FormControl type="text" value={filters.searchText} onChange={this.handleChange('searchText')} onKeyPress={this.handleKeyPress}/>
                <InputGroup.Button>
                  <Button onClick={this.toggleFilters}>
                    <Glyphicon glyph="triangle-bottom"/>
                  </Button>
                </InputGroup.Button>
                <InputGroup.Addon>All Resources</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </div>
        </div>
        <Panel id="search-filter-panel" expanded={open}>
          <Panel.Collapse>
            <Panel.Body>
              <div className="search-filter-close">
                <Button bsStyle='default' onClick={this.toggleFilters}>X</Button>
              </div>
              { 
                React.cloneElement(this.props.children, {
                  handleChange: this.handleChange,
                  filters: filters
                })
              }
              <div className="search-filter-close">
                <Button bsStyle='default' onClick={this.handleReset}>Reset</Button>
                <Button bsStyle='primary' onClick={this.handleSubmit}>Submit</Button>
              </div>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  }
}

export default Search;