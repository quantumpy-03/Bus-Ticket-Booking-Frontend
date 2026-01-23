import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataContext from '../Context/DataContext';
import api from '../api/api';
import { FaHourglass, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Button from './Button';

const MyBooking = () => {
  const { 
    bookings, 
    fetchBookings,
    startCancellation, 
    resetCancellation, 
    cancelBooking, 
    cancellationState
  } = useContext(DataContext);

  const { isCancelling, selectedBookingId, cancelError, cancelSuccess } = cancellationState;
  
  const [busesMap, setBusesMap] = useState({});
  const [isLoadingBuses, setIsLoadingBuses] = useState(true);
  const [activeSort, setActiveSort] = useState('-booking_date');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await api.get('/buses/');
        const busMap = (response.data || []).reduce((map, bus) => {
          map[bus.id] = bus;
          return map;
        }, {});
        setBusesMap(busMap);
      } catch (error) {
        console.error("Failed to fetch bus details:", error);
      } finally {
        setIsLoadingBuses(false);
      }
    };
    fetchBuses();
  }, []);

  const handleSort = (sortBy) => {
    setActiveSort(sortBy);
    fetchBookings(sortBy);
  };

  const getBookingDisplayDetails = (booking) => {
    if (booking.status === 'CANCELLED') {
      return { text: 'CANCELLED', className: 'bg-red-100 text-red-800' };
    }
    if (booking.status === 'BOOKED') {
      if (booking.payment_status === 'completed') {
        return { text: 'CONFIRMED', className: 'bg-green-100 text-green-800' };
      }
      return { text: 'PENDING', className: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: booking.status, className: 'bg-gray-100 text-gray-800' };
  };

  if (!bookings || isLoadingBuses) {
    return <div className="p-6 text-center">Loading your bookings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row gap-5 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 m-0">My Bookings</h1>
        <div className="flex flex-row max-[331px]:flex-col max-[331]:justify-between max-[331px]:space-y-4 min-[331px]:space-x-8">
          <Button
            onClick={() => handleSort(activeSort === '-booking_date' ? 'booking_date' : '-booking_date')}
            variant={activeSort.includes('booking_date') ? 'primary' : 'outline'}
            className="flex items-center space-x-2"
          >
            <span>Booking date</span>
            {activeSort.includes('booking_date') && (
              activeSort === '-booking_date'
                ? <FaArrowDown className='transition-transform duration-300' />
                : <FaArrowUp className='transition-transform duration-300' />
            )}
          </Button>
          <Button
            onClick={() => handleSort(activeSort === '-travel_date' ? 'travel_date' : '-travel_date')}
            variant={activeSort.includes('travel_date') ? 'primary' : 'outline'}
            className="flex items-center space-x-2"
            >
            <span>Travel date</span>
            {activeSort.includes('travel_date') && (
              activeSort === '-travel_date'
                ? <FaArrowDown className='transition-transform duration-300' />
                : <FaArrowUp className='transition-transform duration-300' />
            )}
          </Button>
        </div>
      </div>

      {cancelSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded" role="alert">
          {cancelSuccess}
        </div>
      )}

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const busDetails = busesMap[booking.bus] || {};
            const displayDetails = getBookingDisplayDetails(booking);
            const isCancellable = booking.status === 'BOOKED' && booking.payment_status === 'completed';

            return (
              <div key={booking.id} className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="space-y-4 md:col-span-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                        <div>
                            <p className="text-sm text-gray-500">Bus Operator</p>
                            <p className="text-md md:text-lg font-semibold text-gray-900">{busDetails.owner || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bus Name</p>
                            <p className="text-md md:text-lg font-semibold text-gray-900">{busDetails.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Seats Booked</p>
                            <p className="text-md md:text-lg font-semibold text-gray-900">{booking.seats_booked || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Travel Date</p>
                            <p className="text-md md:text-lg font-semibold text-gray-900">{new Date(booking.travel_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">From</p>
                            <p className="text-md md:text-lg font-semibold text-gray-900">{booking.start_location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">To</p>
                            <p className="text-md md:text-lg font-semibold text-gray-900">{booking.drop_location}</p>
                        </div>                        
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-1">
                    <div className='grid grid-cols-2 md:grid-cols-1 gap-y-4 gap-x-2'>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-md md:text-2xl font-bold text-red-600">₹{(Number(booking.amount) || (busesMap[booking.bus]?.price * booking.seats_booked) || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Booking Status</p>
                        <span className={`px-3 py-1 text-sm md:text-md font-semibold rounded-full ${displayDetails.className}`}>
                          {displayDetails.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 self-center">
                    Booked On: {booking.booking_date ? new Date(booking.booking_date).toLocaleString() : 'N/A'}
                  </div>
                  {isCancellable && (
                    <Button 
                      onClick={() => startCancellation(booking.id)} 
                      variant="danger"
                      className="w-full sm:w-auto"
                    >
                      Cancel Ticket
                    </Button>
                  )}
                  {displayDetails.text === 'CANCELLED' && booking.refund_amount && (
                    <div className="text-sm text-gray-600">
                        Refund Amount: <span className="font-semibold text-green-600">₹{booking.refund_amount}</span>
                        {booking.refund_id && <span className="text-xs text-gray-500 ml-2">(ID: {booking.refund_id})</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">You have no bookings yet.</p>
          <Link to="/destinations">
            <Button variant="primary">Book a Ticket</Button>
          </Link>
        </div>
      )}

      {selectedBookingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Cancel Booking</h3>
            <p className="text-gray-600 mb-6">Are you sure? A refund will be processed based on the cancellation policy.</p>
            
            <div className="bg-blue-50 p-4 rounded mb-6">
              <p className="text-sm text-gray-700"><strong>Refund Policy:</strong></p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• 80% refund if cancelled &gt; 24 hours before departure</li>
                <li>• 50% refund if cancelled 12-24 hours before</li>
                <li>• 25% refund if cancelled &lt; 12 hours before</li>          
              </ul>
            </div>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
                {cancelError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                    onClick={resetCancellation}
                    disabled={isCancelling}
                    variant="secondary"
                    className="w-full"
                >
                    Keep Booking
                </Button>
                <Button 
                    onClick={() => cancelBooking(selectedBookingId)} 
                    disabled={isCancelling}
                    variant="danger"
                    className="w-full flex items-center justify-center"
                >
                    {isCancelling ? (
                    <>
                        <FaHourglass className="animate-spin mr-2" />
                        Processing...
                    </>
                    ) : (
                    'Confirm Cancel'
                    )}
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;
