import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Calendar from '../components/Calendar';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { isEmpty } from 'lodash';

import { resourceSelectors } from '../modules/resources';
import { scheduleActions, scheduleSelectors } from '../modules/schedule';

import { DateTimePicker } from 'react-widgets';
import {
  Button,
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal
} from 'react-bootstrap';


moment.locale('en');
momentLocalizer();

const EMPTY_EVENT = {
  title: '',
  block_start: null,
  block_end: null,
  allDay: false,
  repeat: false,
  cadence: null,
  start: null,
  end: null
};

class RequestResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      selectedEvent: EMPTY_EVENT,
      showEventDetails: false,
      selectedEventIdx: -1
    };
  }

  componentDidMount() {
    const { fetchResourceSchedule, match: { params } } = this.props;
    this.props.fetchResourceSchedule(params.id);
  }

  checkNoOverlap = (event) => {
    return this.checkNoOverlapHelper(event, this.props.events); // && this.checkNoOverlapHelper(event, this.props.events);
  }

  checkNoOverlapHelper = (event, eventList) => {
    return eventList.find(currentEvent => {
      const currentEventStart = moment(currentEvent.start);
      const currentEventEnd = moment(currentEvent.end);
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);

      return (currentEventStart.isSameOrBefore(eventStart, 'minute') && currentEventEnd.isSameOrAfter(eventStart, 'minute')) ||
      (currentEventStart.isSameOrBefore(eventEnd, 'minute') && currentEventEnd.isSameOrAfter(eventEnd, 'minute'));

    }) === undefined;
  }

  handleEventResize = ({ event, start, end }) => {
    const { events } = this.state;

    if (!this.checkNoOverlap(event)) {
      return false;
    }

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    });

    this.setState({
      events: nextEvents,
    });
  }

  handleSelectEvent = (event) => {
    const { events } = this.props;
    const idx = events.indexOf(event);

    this.setState({
      selectedEventIdx: idx,
      selectedEvent: {
        ...events[idx],
        block_start: new Date(event.block_start + "-0500"),
        block_end: new Date(event.block_end + "-0500"),
        allDay: this.allDayCheck(event),
        repeat: !isEmpty(event.block_recurring)
      },
      showEventDetails: true
    });
  }

  handleSelectSlot = ({ start, end }) => {
    const { isMyResource, match: { params }, submitSchedule, validateRequestBlocks } = this.props;
    const { selectedEvent } = this.state;
    const momentEnd = moment(end);

    const realEnd = momentEnd.hour() === 0 && momentEnd.minute() === 0 ? momentEnd.set({ hour: 23, minute: 59 }).toDate() : end;
    
    if (!this.checkNoOverlap({ start, end: realEnd })) {
      return false;
    }

    const event = {
      resource_id: params.id,
      block_start: moment(start).format('YYYY-MM-DD HH:mm'),
      block_end: moment(realEnd).format('YYYY-MM-DD HH:mm'),
      block_recurring: {
        cadence: selectedEvent.cadence,
        start: selectedEvent.recurring_start,
        end: selectedEvent.recurring_end
      }
    };

    if (!selectedEvent.repeat) {
      event.block_recurring = {};
    }

    if (isMyResource) {
      validateRequestBlocks(event);
      submitSchedule(event)
    }
  }

  handleEventDetailClose = () => {
    this.setState({
      selectedEvent: EMPTY_EVENT,
      showEventDetails: false
    })
  }

  handleSaveEvent = () => {
    const { isMyResource, match: { params }, submitSchedule, validateRequestBlocks } = this.props;
    const { selectedEvent } = this.state;

    const event = {
      resource_id: params.id,
      block_start: moment(selectedEvent.block_start).format('YYYY-MM-DD HH:mm'),
      block_end: moment(selectedEvent.block_end).format('YYYY-MM-DD HH:mm'),
      block_recurring: {
        cadence: selectedEvent.cadence,
        start: moment(selectedEvent.recurring_start).format('YYYY-MM-DD'),
        end: moment(selectedEvent.recurring_end).format('YYYY-MM-DD'),
      }
    };

    if (!selectedEvent.repeat) {
      event.block_recurring = {};
    }

    if (isMyResource) {
      validateRequestBlocks(event);
      submitSchedule(event)
    }
    this.setState({
      showEventDetails: false
    });
  }

  handleUpdateEvent = (name) => (event) => {
    const selectedEvent = {
      ...this.state.selectedEvent,
      [name]: event.target.value
    };
    this.setState({ selectedEvent });
  }

  handleDeleteEvent = () => {
    const { events, selectedEventIdx } = this.state;
    this.setState({
      events: [
        ...events.slice(0, selectedEventIdx),
        ...events.slice(selectedEventIdx + 1),
      ],
      selectedEventIdx: null,
      selectedEvent: EMPTY_EVENT,
      showEventDetails: false
    });
  }

  handleUpdateCheckedEvent = (name) => (event) => {
    const selectedEvent = {
      ...this.state.selectedEvent,
      [name]: event.target.checked
    };
    this.setState({ selectedEvent });
  }

  handleUpdateDateEvent = name => value => {
    const selectedEvent = {
      ...this.state.selectedEvent,
      [name]: value
    };
    this.setState({ selectedEvent })
  }

  handleChange = (name) => (event) => {
    const selectedEvent = {
      ...this.state.selectedEvent,
      [name]: event.target.value
    };
    this.setState({ selectedEvent });
  }

  handleNavigate = action => {
    console.log('action', action);
  }

  handleSubmitSchedule = () => {
    // this.props.submitSchedule(this.state.events);
  }

  allDayCheck = event => {
    const { block_start, block_end } = event;
    const start = moment(block_start);
    const end = moment(block_end);

    return start.isSame(end, 'day') && start.hour() === 0 && start.minute() === 0 && end.hour() === 23 && end.minute() === 59;
  }

  render() {
    const { showEventDetails, selectedEvent } = this.state;
    const { events } = this.props;

    const dateFormat = selectedEvent.allDay ? "MMMM DD, YYYY" : "MMMM DD, YYYY - h:mm A";
    return (
      <div style={{display: 'flex', flexGrow: 1}}>
        <div>
          <Button bsStyle="primary" onClick={this.handleSubmitSchedule}>Submit</Button>
        </div>
        <Calendar
          events={events}
          onEventResize={this.handleEventResize}
          onSelectEvent={this.handleSelectEvent}
          onSelectSlot={this.handleSelectSlot}
          onNavigate={this.handleNavigate}
          startAccessor="block_start"
          endAccessor="block_end"
          allDayAccessor={this.allDayCheck}
        />
        <Modal show={showEventDetails} onHide={this.handleEventDetailClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedEvent.title}</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <Form horizontal onSubmit={this.handleSaveEvent}>
              <FormGroup controlId="formTitle">
                <Col componentClass={ControlLabel} sm={2}>Title</Col>
                <Col sm={10}>
                  <FormControl placeholder="Title" onChange={this.handleUpdateEvent('title')} value={selectedEvent.title} />
                </Col>
              </FormGroup>

              <FormGroup controlId="formStart">
                <Col componentClass={ControlLabel} sm={2}>Start</Col>
                <Col sm={10}>
                  <DateTimePicker
                    time={!selectedEvent.allDay}
                    format={dateFormat}
                    onChange={this.handleUpdateDateEvent('block_start')}
                    value={selectedEvent.block_start}
                  />
                </Col>
              </FormGroup>

              <FormGroup controlId="formEnd">
                <Col componentClass={ControlLabel} sm={2}>End</Col>
                <Col sm={10}>
                  <DateTimePicker
                    min={selectedEvent.block_start}
                    time={!selectedEvent.allDay}
                    format={dateFormat}
                    onChange={this.handleUpdateDateEvent('block_end')}
                    value={selectedEvent.block_end}
                  />
                </Col>
              </FormGroup>
              

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Checkbox
                    checked={selectedEvent.allDay}
                    onChange={this.handleUpdateCheckedEvent('allDay')}
                  >All Day</Checkbox>
                </Col>
              </FormGroup>

              <FormGroup>
                <Col smOffset={2} sm={2}>
                  <Checkbox
                    checked={selectedEvent.repeat}
                    onChange={this.handleUpdateCheckedEvent('repeat')}
                  >Repeat</Checkbox>
                </Col>
                {
                  selectedEvent.repeat &&
                  <Col sm={4}>
                    <FormControl componentClass="select" placeholder="Cadence" onChange={this.handleChange('cadence')} value={selectedEvent.cadence}>
                      <option value="">N/A</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                    </FormControl>
                  </Col>
                }
              </FormGroup>

              {
                selectedEvent.repeat &&
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Start</Col>
                  <Col sm={4}>
                    <DateTimePicker
                      min={new Date()}
                      format='MMMM DD, YYYY'
                      time={false}
                      onChange={this.handleUpdateDateEvent('recurring_start')}
                      value={selectedEvent.recurring_start}
                    />
                  </Col>
                  <Col componentClass={ControlLabel} sm={2}>End</Col>
                  <Col sm={4}>
                    <DateTimePicker
                      min={new Date()}
                      format='MMMM DD, YYYY'
                      time={false}
                      onChange={this.handleUpdateDateEvent('recurring_end')}
                      value={selectedEvent.recurring_end}
                    />
                  </Col>
                </FormGroup>
              }

            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="danger" onClick={this.handleDeleteEvent}>Delete Event</Button>
            <Button bsStyle="primary" onClick={this.handleSaveEvent}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  isMyResource: resourceSelectors.resourceOwnedByCurrentUser(state, props.match.params.id),
  events: scheduleSelectors.getEvents(state)
});

const mapDispatchToProps = (dispatch) => ({
  fetchResourceSchedule: bindActionCreators(scheduleActions.fetchResourceSchedule, dispatch),
  submitSchedule: bindActionCreators(scheduleActions.submitScheduleBlock, dispatch),
  validateRequestBlocks: bindActionCreators(scheduleActions.validateRequestBlocks, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestResource));