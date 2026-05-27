import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import RoomCard from '../components/RoomCard';
import { PlusCircle } from 'lucide-react';

const MyListings = () => {
  useDocumentTitle('My Listings');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const { data } = await api.get('/rooms/my-listings');
        setRooms(data);
      } catch (error) {
        console.error("Error fetching my listings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  if (loading) {
    return <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center"><Spinner /></div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-1">Manage the study rooms you've added to the platform.</p>
          </div>
          <Link 
            to="/add-room" 
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <PlusCircle size={20} /> Add New Room
          </Link>
        </div>

        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
              <PlusCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Listings Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              You haven't added any study rooms to the platform yet. Start earning by listing your private space.
            </p>
            <Link 
              to="/add-room" 
              className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg"
            >
              List Your First Room
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
