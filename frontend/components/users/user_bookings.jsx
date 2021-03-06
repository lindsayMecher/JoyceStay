import React from 'react';
import { connect } from 'react-redux';
import BookingItem from './booking_item';
import Loading from '../misc/loading';
import { receiveMessages } from '../../actions/ui';

class UserBookings extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { 
      user,
      fetchUserBookings 
    } = this.props;

    if(user.booking_ids.length) {
      fetchUserBookings(user.id)
    }
  }

  destroyBooking = (id) => {
    return this.props.destroyBooking(id).then(() => {
      this.props.receiveMessages(["Your booking was successfully cancelled."], 'bookings')
    })
  }

  render() {
    const { 
      bookings, 
      bookingLoading,
      user
    } = this.props;

    const loading = user.booking_ids.length ? bookingLoading : false;
    
    if(loading) {
      return <Loading />
    }
    
    return (
      bookings.length ? 
        <div className="bookings-panel">
          { bookings.map(booking => <BookingItem key={booking.id} booking={booking} destroyBooking={this.destroyBooking} />) }
        </div>
        :
        <h4>You have not made any bookings</h4>
    )
  }
} 

const msp = (state) => ({
  bookings: Object.values(state.entities.bookings),
  bookingLoading: state.ui.bookingLoading
});

export default connect(msp)(UserBookings)