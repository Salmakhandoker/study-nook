import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { Users, DollarSign, MapPin, CheckCircle, Calendar, Clock, X, Edit, Trash2 } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Booking Form State
  const [date, setDate] = useState('');
  const [startHour, setStartHour] = useState('08');
  const [endHour, setEndHour] = useState('09');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle(room ? `${room.name}` : 'Room Details');

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room details", error);
        toast.error("Could not fetch room details");
        navigate('/rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [id, navigate]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/rooms/${id}` } } });
      return;
    }
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(endHour) <= parseInt(startHour)) {
      toast.error("End time must be after start time");
      return;
    }
    
    setIsSubmitting(true);
    
    const startTimeStr = `${startHour}:00`;
    const endTimeStr = `${endHour}:00`;
    const totalCost = (parseInt(endHour) - parseInt(startHour)) * room.hourlyRate;
    
    try {
      await api.post('/bookings', {
        roomId: room._id,
        roomName: room.name,
        roomImage: room.image,
        date,
        startTime: startTimeStr,
        endTime: endTimeStr,
        totalCost
      });
      
      toast.success('Room booked successfully!');
      setIsBookingModalOpen(false);
      
      // Optionally refresh room data to update bookingCount
      const { data } = await api.get(`/rooms/${id}`);
      setRoom(data);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book room. It may be already booked for this time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await api.delete(`/rooms/${id}`);
      toast.success('Room deleted successfully');
      navigate('/my-listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
    setIsDeleteModalOpen(false);
  };

  // Generate hours for dropdown
  const hours = Array.from({ length: 13 }, (_, i) => i + 8).map(h => (h < 10 ? `0${h}` : `${h}`)); // 08 to 20

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  }

  if (!room) return null;

  const totalBookingCost = (parseInt(endHour) - parseInt(startHour)) * room.hourlyRate;

  const isOwner = user && user.id === room.ownerId;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Image */}
          <div className="relative h-64 md:h-96">
            <img 
              src={room.image} 
              alt={room.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200' }}
            />
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Booked {room.bookingCount} times
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{room.name}</h1>
                <div className="flex items-center gap-4 mt-3 text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={18} /> {room.floor}</span>
                  <span className="flex items-center gap-1"><Users size={18} /> {room.capacity} people</span>
                  <span className="flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md"><DollarSign size={18} /> ${room.hourlyRate}/hr</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {isOwner && (
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => navigate(`/edit-room/${room._id}`)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      <Edit size={18} /> Edit
                    </button>
                    <button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={handleBookNow}
                  className="flex-1 md:flex-none px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg w-full"
                >
                  {user ? 'Book Now' : 'Login to Book'}
                </button>
              </div>
            </div>

            <div className="prose max-w-none mb-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{room.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {room.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={18} className="text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
                {(!room.amenities || room.amenities.length === 0) && (
                  <p className="text-gray-500 italic">No amenities listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Book Room</h2>
              <button onClick={() => setIsBookingModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} /> Date
                  </label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]} // Must be today or future
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Clock size={16} /> Start Time
                    </label>
                    <select 
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                      {hours.slice(0, -1).map(h => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Clock size={16} /> End Time
                    </label>
                    <select 
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                      {hours.map(h => (
                        <option key={h} value={h} disabled={parseInt(h) <= parseInt(startHour)}>
                          {h}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                    <span>Hourly Rate</span>
                    <span>${room.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                    <span>Duration</span>
                    <span>{Math.max(0, parseInt(endHour) - parseInt(startHour))} hrs</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between items-center font-bold text-gray-900 text-lg">
                    <span>Total Cost</span>
                    <span className="text-primary">${totalBookingCost > 0 ? totalBookingCost : 0}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || totalBookingCost <= 0}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
                    isSubmitting || totalBookingCost <= 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-hover shadow-md'
                  }`}
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Room?</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to permanently delete "{room.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteRoom}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoomDetails;
