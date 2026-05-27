import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { PlusCircle, Save } from 'lucide-react';
import Spinner from '../components/Spinner';

const RoomForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  useDocumentTitle(isEdit ? 'Edit Room' : 'Add Room');
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const availableAmenities = [
    'Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    floor: '',
    capacity: 1,
    hourlyRate: 5,
    amenities: []
  });

  useEffect(() => {
    if (isEdit) {
      const fetchRoom = async () => {
        try {
          const { data } = await api.get(`/rooms/${id}`);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            image: data.image || '',
            floor: data.floor || '',
            capacity: data.capacity || 1,
            hourlyRate: data.hourlyRate || 5,
            amenities: data.amenities || []
          });
        } catch (error) {
          toast.error('Failed to load room details');
          navigate('/my-listings');
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      const isSelected = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: isSelected 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEdit) {
        await api.put(`/rooms/${id}`, formData);
        toast.success('Room updated successfully');
        navigate(`/rooms/${id}`);
      } else {
        await api.post('/rooms', formData);
        toast.success('Room added successfully');
        navigate('/my-listings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} room`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center"><Spinner /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-primary px-8 py-6 text-white flex items-center gap-3">
            {isEdit ? <Save size={28} /> : <PlusCircle size={28} />}
            <div>
              <h1 className="text-2xl font-bold">{isEdit ? 'Edit Room Listing' : 'Add New Study Room'}</h1>
              <p className="text-blue-100 text-sm mt-1">
                {isEdit ? 'Update the details of your study room.' : 'Fill out the form below to list your room on StudyNook.'}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="e.g., Quiet Corner Room A"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="Describe the room, its atmosphere, and rules..."
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-3 relative h-32 w-48 rounded-lg overflow-hidden border border-gray-200">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Floor</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="e.g., 3rd Floor, West Wing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seat Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($) *</label>
                <input
                  type="number"
                  name="hourlyRate"
                  min="0"
                  step="0.01"
                  required
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-primary text-white font-bold rounded-lg transition-colors shadow-md ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-hover hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Room' : 'List Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomForm;
