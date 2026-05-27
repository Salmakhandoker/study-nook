import { useState, useEffect } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../utils/api';
import RoomCard from '../components/RoomCard';
import Spinner from '../components/Spinner';
import { Search, Filter, X } from 'lucide-react';

const Rooms = () => {
  useDocumentTitle('Available Rooms');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const availableAmenities = [
    'Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch rooms when search or filters change
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        let queryParams = [];
        if (debouncedSearch) {
          queryParams.push(`search=${encodeURIComponent(debouncedSearch)}`);
        }
        if (selectedAmenities.length > 0) {
          queryParams.push(`amenities=${encodeURIComponent(selectedAmenities.join(','))}`);
        }
        
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const { data } = await api.get(`/rooms${queryString}`);
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [debouncedSearch, selectedAmenities]);

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAmenities([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Study Rooms</h1>
            <p className="text-gray-600 mt-2">Find the perfect space for your next study session.</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by room name..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                isFilterOpen || selectedAmenities.length > 0 
                  ? 'bg-primary text-white border-primary hover:bg-primary-hover' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
              {selectedAmenities.length > 0 && (
                <span className="bg-white text-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ml-1">
                  {selectedAmenities.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter by Amenities</h3>
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1">
                <X className="h-4 w-4" /> Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary transition duration-150 ease-in-out"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any rooms matching your current search criteria or filters. Try adjusting them to see more results.
            </p>
            <button 
              onClick={clearFilters}
              className="mt-6 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
