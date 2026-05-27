import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { Calendar, Clock, DollarSign, XCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

const MyBookings = () => {
  useDocumentTitle('My Bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data);
    } catch (error) {
      console.error("Error fetching my bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);
    try {
      await api.patch(`/bookings/${bookingToCancel._id}/cancel`);
      toast.success('Booking cancelled successfully');
      
      // Update local state to reflect cancellation
      setBookings(bookings.map(b => 
        b._id === bookingToCancel._id ? { ...b, status: 'cancelled' } : b
      ));
      
      setIsCancelModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
      setBookingToCancel(null);
    }
  };

  // Check if booking is in the future
  const isFutureBooking = (dateString) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center"><Spinner /></div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage your upcoming and past study sessions.</p>
        </div>

        {bookings.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-sm font-semibold border-b border-gray-200">
                    <th className="p-4 pl-6">Room Info</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {bookings.map(booking => {
                    const isConfirmed = booking.status === 'confirmed';
                    const canCancel = isConfirmed && isFutureBooking(booking.date);
                    
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                              <img 
                                src={booking.roomImage} 
                                alt={booking.roomName} 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150' }}
                              />
                            </div>
                            <div>
                              <Link to={`/rooms/${booking.roomId}`} className="font-semibold text-gray-900 hover:text-primary transition-colors">
                                {booking.roomName}
                              </Link>
                              <div className="text-xs text-gray-500 mt-1">ID: {booking._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-900">
                            <Calendar size={14} className="text-gray-400" />
                            {format(new Date(booking.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={14} className="text-gray-400" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 font-semibold text-gray-900">
                            <DollarSign size={14} className="text-gray-400" />
                            {booking.totalCost}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isConfirmed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isConfirmed ? 'Confirmed' : 'Cancelled'}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          {canCancel ? (
                            <button
                              onClick={() => handleCancelClick(booking)}
                              className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-red-100"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400 italic">
                              {!isConfirmed ? 'Already Cancelled' : 'Past Booking'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
              <Calendar size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              You haven't booked any study rooms. Browse our available rooms and find your perfect spot.
            </p>
            <Link 
              to="/rooms" 
              className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Search size={20} /> Explore Rooms
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h3>
            <p className="text-gray-500 mb-2">
              Are you sure you want to cancel your booking for <span className="font-semibold">{bookingToCancel.roomName}</span>?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Date: {format(new Date(bookingToCancel.date), 'MMM dd, yyyy')} ({bookingToCancel.startTime} - {bookingToCancel.endTime})
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                disabled={cancelling}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button 
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {cancelling ? <Spinner /> : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
