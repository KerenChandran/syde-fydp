import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

class Dnd extends Component {

  handleSelectSlot = (slotInfo) => {
    if (moment(slotInfo.start).isSameOrAfter(new Date())) {
      this.props.onSelectSlot(slotInfo)
    }
  }

  render() {
    const { events, onEventDrop, onEventResize, onSelectEvent, ...others } = this.props;

    return (
      <DragAndDropCalendar
        {...others}
        selectable
        resizable
        defaultDate={new Date() /* Temp fix that can be removed once lib fixes the issue */}
        events={events}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        onSelectEvent={onSelectEvent}
        onSelectSlot={this.handleSelectSlot}
        defaultView="month"
        views={['month', 'week']}
      />
    );
  }
}

Dnd.defaultProps = {
  events: [],
  onEventDrop: () => {},
  onEventResize: () => {},
  onSelectEvent: () => {}
};

Dnd.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  onEventDrop: PropTypes.func,
  onEventResize: PropTypes.func,  
  onSelectEvent: PropTypes.func
};

export default DragDropContext(HTML5Backend)(Dnd);