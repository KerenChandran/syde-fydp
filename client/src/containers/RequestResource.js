import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Calendar from '../components/Calendar';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

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
  block_end: null
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
    console.log('CALL SCHEDULE ENDPOINT TO RECEIVE CURRENT SCHEDULE!!');
  }

  checkNoOverlap = (event) => {
    return this.checkNoOverlapHelper(event, this.state.events); // && this.checkNoOverlapHelper(event, this.props.events);
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
    const { events } = this.state;
    const idx = events.indexOf(event);

    this.setState({
      selectedEventIdx: idx,
      selectedEvent: events[idx],
      showEventDetails: true
    });
  }

  handleSelectSlot = ({ start, end }) => {
    const { isMyResource } = this.props;
    const { events } = this.state;
    const momentEnd = moment(end);

    const realEnd = momentEnd.hour() === 0 && momentEnd.minute() === 0 ? momentEnd.set({ hour: 23, minute: 59 }).toDate() : end;
    
    if (!this.checkNoOverlap({ start, end: realEnd })) {
      return false;
    }

    if (isMyResource) {
      this.props.validateRequestBlocks({
        resource_id: this.props.match.params.id,
        block_start: start,
        block_end: realEnd,
        allDay: start === end,
        block_recurring: {}
      });
      this.props.submitSchedule({
        resource_id: this.props.match.params.id,
        block_start: start,
        block_end: realEnd,
        allDay: start === end,
        block_recurring: {}
      })
    } else {
      this.setState({
        events: [
          ...events,
          {
            resource_id: this.props.match.params.id,
            title: 'No Title',
            block_start: start,
            block_end: realEnd,
            allDay: start === end,
            block_recurring: {}
          }
        ]
      });
    }
  }

  handleEventDetailClose = () => {
    this.setState({
      selectedEvent: EMPTY_EVENT,
      showEventDetails: false
    })
  }

  handleSaveEvent = () => {
    const { events, selectedEvent, selectedEventIdx } = this.state;
    this.setState({
      events: [
        ...events.slice(0, selectedEventIdx),
        selectedEvent,
        ...events.slice(selectedEventIdx + 1),
      ],
      selectedEvent: EMPTY_EVENT,
      showEventDetails: false
    });
    return false
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

  handleNavigate = action => {
    console.log('action', action);
  }

  handleSubmitSchedule = () => {
    // this.props.submitSchedule(this.state.events);
  }

  render() {
    const { events: stateEvents, showEventDetails, selectedEvent } = this.state;
    const { scheduledEvents } = this.props;
    const dateFormat = selectedEvent.allDay ? "MMMM DD, YYYY" : "MMMM DD, YYYY - h:mm A";
    return (
      <div style={{display: 'flex', flexGrow: 1}}>
        <div>
          <button onClick={this.handleSubmitSchedule}>Submit</button>
        </div>
        <Calendar
          events={[scheduledEvents, ...stateEvents]}
          onEventResize={this.handleEventResize}
          onSelectEvent={this.handleSelectEvent}
          onSelectSlot={this.handleSelectSlot}
          onNavigate={this.handleNavigate}
          startAccessor="block_start"
          endAccessor="block_end"
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
                    onChange={this.handleUpdateDateEvent('start')}
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
                    onChange={this.handleUpdateDateEvent('end')}
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
                    checked={selectedEvent.allDay}
                    onChange={this.handleUpdateCheckedEvent('allDay')}
                  >Repeat</Checkbox>
                </Col>
                <Col sm={4}>
                  <Checkbox
                    checked={selectedEvent.allDay}
                    onChange={this.handleUpdateCheckedEvent('allDay')}
                  >Repeat</Checkbox>
                </Col>
              </FormGroup>
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
  scheduledEvents: scheduleSelectors.getEvents(state)
});

const mapDispatchToProps = (dispatch) => ({
  submitSchedule: bindActionCreators(scheduleActions.submitScheduleBlock, dispatch),
  validateRequestBlocks: bindActionCreators(scheduleActions.validateRequestBlocks, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestResource));