import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Calendar from '../components/Calendar';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { isEmpty } from 'lodash';

import { resourceSelectors, resourceActions } from '../modules/resources';
import { scheduleActions, scheduleSelectors } from '../modules/schedule';
import { userSelectors } from '../modules/users';

import { DateTimePicker } from 'react-widgets';
import {
  Button,
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal,
  Row
} from 'react-bootstrap';


moment.locale('en');
momentLocalizer();

const EMPTY_EVENT = {
  block_start: null,
  block_end: null,
  allDay: false,
  repeat: false,
  cadence: 'daily',
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
      selectedEventIdx: -1,
      requestedEvent: false
    };
  }

  componentDidMount() {
    const { fetchResourceSchedule, match: { params } } = this.props;
    if (params.id != null) {
      this.props.fetchResource(params.id)
      this.props.fetchResourceSchedule(params.id);
    }
  }

  checkNoOverlap = (event) => {
    const { availableEvents, newAvailableEvents, requestedEvents, newRequestedEvents } = this.props;
    return this.checkNoOverlapHelper(event, requestedEvents) && this.checkNoOverlapHelper(event, newRequestedEvents) && this.checkNoOverlapHelper(event, availableEvents) && this.checkNoOverlapHelper(event, newAvailableEvents);
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
    const { availableEvents, requestedEvents, newAvailableEvents, newRequestedEvents, currentUser } = this.props;
    if (event.user_id !== currentUser.id) {
      return false;
    }
    let requestedEvent = false;
    let availableEvent = false;

    let selectedEventIdx = availableEvents.indexOf(event);
    if (selectedEventIdx < 0) {
      selectedEventIdx = requestedEvents.indexOf(event);
    }
    if (selectedEventIdx < 0) {
      selectedEventIdx = newRequestedEvents.indexOf(event);
      requestedEvent = selectedEventIdx >= 0;
    }
    if (selectedEventIdx < 0) {
      selectedEventIdx = newAvailableEvents.indexOf(event);
      availableEvent = selectedEventIdx >= 0;;
    }

    this.setState({
      availableEvent,
      requestedEvent,
      selectedEventIdx,
      selectedEvent: {
        block_start: new Date(event.block_start),
        block_end: new Date(event.block_end),
        allDay: this.allDayCheck(event),
        repeat: !isEmpty(event.block_recurring)
      },
      showEventDetails: true
    });
  }

  handleSelectSlot = async ({ start, end }) => {
    const { availableEvents, newAvailableEvents, newRequestedEvents, isMyResource, match: { params }, currentUser, saveAvailableEvent, validateRequestBlocks } = this.props;
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
        end: selectedEvent.recurring_end,
      }
    };

    if (!selectedEvent.repeat) {
      event.block_recurring = {};
    }

    if (isMyResource || params.id == null) {
      await saveAvailableEvent([...availableEvents, ...newAvailableEvents], event, currentUser.id)
      this.setState({
        availableEvent: true,
        requestedEvent: false,
        selectedEventIdx: newAvailableEvents.length,
        selectedEvent: {
          block_start: start,
          block_end: realEnd,
          allDay: this.allDayCheck({
            block_start: start,
            block_end: realEnd
          }),
          user_id: currentUser.id,
          repeat: false,
          recurring_start: start,
          cadence: 'daily'
        },
        showEventDetails: true
      });
    } else { 
      this.setState({
        availableEvent: false,
        requestedEvent: true,
        selectedEventIdx: newRequestedEvents.length,
        selectedEvent: {
          block_start: start,
          block_end: realEnd,
          allDay: this.allDayCheck({
            block_start: start,
            block_end: realEnd
          }),
          user_id: currentUser.id,
          repeat: false,
          recurring_start: start,
          cadence: 'daily'
        },
        showEventDetails: true
      });
    }
  }

  handleEventDetailClose = () => {
    this.setState({
      selectedEvent: EMPTY_EVENT,
      showEventDetails: false
    })
  }

  handleSaveEvent = e => {
    e.preventDefault();
    const { availableEvents, newAvailableEvents, currentUser, isMyResource, match: { params }, saveAvailableEvent, validateRequestBlocks } = this.props;
    const { selectedEvent } = this.state;

    if (selectedEvent.block_start == null || selectedEvent.block_end == null || (selectedEvent.repeat && (selectedEvent.recurring_start == null || selectedEvent.recurring_end == null))) {
      return false;
    }

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

    (isMyResource || params.id == null) ? saveAvailableEvent([...availableEvents, ...newAvailableEvents], event, currentUser.id) : validateRequestBlocks(event);

    this.handleEventDetailClose();
  }

  handleDeleteEvent = () => {
    const { events, selectedEventIdx, selectedEvent, requestedEvent, availableEvent } = this.state;
    if (availableEvent) {
      this.props.deleteAvailableEvent(selectedEventIdx);
    } else if (requestedEvent) {
      this.props.deleteEvent(selectedEventIdx, requestedEvent);
    }
    this.setState({
      selectedEventIdx: null,
      selectedEvent: EMPTY_EVENT,
      showEventDetails: false,
      requestedEvent: false
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

  handleSubmitSchedule = () => {
    const { history, match: { params: { id }} } = this.props;
    history.push(`/resources/${id}/request`);
    // history.push(`/resources/${id}/incentive`);
  }

  handleFinish = () => {
    const { match: { params }, history } = this.props;
    params.id == null ? history.push('/resources/new/confirm') : history.push(`/resources/${params.id}/confirm`);
  }

  allDayCheck = event => {
    const { block_start, block_end } = event;
    const start = moment(block_start);
    const end = moment(block_end);

    return start.isSame(end, 'day') && start.hour() === 0 && start.minute() === 0 && end.hour() === 23 && end.minute() === 59;
  }

  titleAccessor = event => {
    const { currentUser, match: { params }, resource } = this.props;
    if (params.id == null || event.user_id === resource.ownerid) {
      return 'Available';
    }
    return `${currentUser.first_name} ${currentUser.last_name}`
  } 

  validateField = name => {
    if (this.state.selectedEvent[name] == null) {
      return 'error';
    }
    return 'success';
  }

  validateRecurringField = name => {
    if (this.state.repeat) {
      return this.validateField(name);
    }
    return null;
  }

  render() {
    const { showEventDetails, selectedEvent, requestedEvent, availableEvent } = this.state;
    const { newAvailableEvents, newRequestedEvents, availableEvents, currentUser, isMyResource, requestedEvents, resource, match: { params } } = this.props;

    if (params.id == null && !resource) {
      return null;
    }
    const dateFormat = selectedEvent.allDay ? "MMMM DD, YYYY" : "MMMM DD, YYYY - h:mm A";
    return (
      <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 10}}>
          {
            (isMyResource || params.id == null) ?
            <Button bsStyle="primary" onClick={this.handleFinish}>Continue</Button> :
            newRequestedEvents.length ? 
            <Button bsStyle="primary" onClick={this.handleSubmitSchedule}>Continue</Button> :
            null
          }
        </div>
        <Calendar
          events={[...availableEvents, ...newAvailableEvents, ...requestedEvents, ...newRequestedEvents]}
          onEventResize={this.handleEventResize}
          onSelectEvent={this.handleSelectEvent}
          onSelectSlot={this.handleSelectSlot}
          onNavigate={this.handleNavigate}
          titleAccessor={this.titleAccessor}
          startAccessor={event => new Date(event.block_start)}
          endAccessor={event => new Date(event.block_end)}
          allDayAccessor={this.allDayCheck}
        />
        <Modal show={showEventDetails} onHide={this.handleEventDetailClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedEvent.title}</Modal.Title>
          </Modal.Header>
          <Form horizontal onSubmit={this.handleSaveEvent}>
            <Modal.Body>
              <FormGroup controlId="formStart" validationState={this.validateField('block_start')}>
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

              <FormGroup controlId="formEnd" validationState={this.validateField('block_end')}>
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
                    inline
                    checked={selectedEvent.allDay}
                    onChange={this.handleUpdateCheckedEvent('allDay')}
                  >All Day</Checkbox>
                  <Checkbox
                    inline
                    checked={selectedEvent.repeat}
                    onChange={this.handleUpdateCheckedEvent('repeat')}
                  >Repeat</Checkbox>
                </Col>
              </FormGroup>
              {
                selectedEvent.repeat &&
                <FormGroup controlId="formCadence">
                  <Col componentClass={ControlLabel} sm={2}>Cadence</Col>
                  <Col sm={10}>
                    <FormControl componentClass="select" placeholder="Cadence" onChange={this.handleChange('cadence')} value={selectedEvent.cadence}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                    </FormControl>
                  </Col>
                </FormGroup>
              }

              {
                selectedEvent.repeat &&
                <div>
                  <FormGroup controlId="formRecurringStart" validationState={this.validateField('recurring_start')}>
                    <Col componentClass={ControlLabel} sm={2}>Start</Col>
                    <Col sm={10}>
                      <DateTimePicker
                        min={new Date()}
                        format='MMMM DD, YYYY'
                        time={false}
                        onChange={this.handleUpdateDateEvent('recurring_start')}
                        value={selectedEvent.recurring_start}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formRecurringEnd" validationState={this.validateField('recurring_end')}>
                    <Col componentClass={ControlLabel} sm={2}>End</Col>
                    <Col sm={10}>
                      <DateTimePicker
                        min={new Date()}
                        format='MMMM DD, YYYY'
                        time={false}
                        onChange={this.handleUpdateDateEvent('recurring_end')}
                        value={selectedEvent.recurring_end}
                      />
                    </Col>
                  </FormGroup>
                </div>
              }
            </Modal.Body>

            <Modal.Footer>
              { requestedEvent || availableEvent ? <Button bsStyle="danger" onClick={this.handleDeleteEvent}>Delete Event</Button> : null }
              <Button bsStyle="primary" type="submit">Save Changes</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  isMyResource: resourceSelectors.resourceOwnedByCurrentUser(state, props.match.params.id),
  requestedEvents: scheduleSelectors.getRequestedEvents(state),
  currentUser: userSelectors.currentUser(state),
  availableEvents: scheduleSelectors.getAvailableEvents(state),
  newAvailableEvents: scheduleSelectors.getNewAvailableEvents(state),
  newRequestedEvents: scheduleSelectors.getNewRequestedEvents(state),
  resource: resourceSelectors.getResource(state, props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  deleteEvent: bindActionCreators(scheduleActions.deleteRequestedEvent, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  fetchResourceSchedule: bindActionCreators(scheduleActions.fetchResourceSchedule, dispatch),
  submitSchedule: bindActionCreators(scheduleActions.submitScheduleBlock, dispatch),
  validateRequestBlocks: bindActionCreators(scheduleActions.validateRequestBlocks, dispatch),
  saveAvailableEvent: bindActionCreators(scheduleActions.saveAvailableEvent, dispatch),
  clearEvents: bindActionCreators(scheduleActions.clearEvents, dispatch),
  deleteAvailableEvent: bindActionCreators(scheduleActions.deleteAvailableEvent, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestResource));
